import amqplib from 'amqplib';
import { TxDetails } from '../parser/protocols/protocol-types';

export class RabbitMqConnection {
    private connection: amqplib.Connection | undefined;
    private _channel: amqplib.Channel | undefined;

    get channel(): amqplib.Channel {
        return this._channel!;
    }

    async setUp(): Promise<void> {
        await this.setUpConnection();
        await this.setUpChannel();
        await this.channel.assertQueue('nnp-msg-queue');
    }

    private async setUpConnection(): Promise<void> {
        try {
            console.log('Connecting to RabbitMQ...');
            this.connection = await amqplib.connect(process.env.RABBITMQ_URL!);
        } catch (err: any) {
            console.log(`Failed to connect: ${err}`);
            throw new Error(err);
        } finally {
            console.log('Connected to RabbitMQ');
        }
        this.connection.on('error', async (err) => {
            console.log(`Disconnecting due to a connection error: ${err}`);
            await this.disconnect();
        });
    }

    private async setUpChannel(): Promise<void> {
        try {
            this._channel = await this.connection!.createChannel();
        } catch (err) {
            console.log(`Disconnecting due to channel creation failing: ${err}`);
            await this.disconnect();
            throw new Error(err as string);
        }
        this.channel.on('error', async (err) => {
            console.log(`Disconnecting due to a channel error: ${err}`);
            await this.disconnect();
        });
    }

    async disconnect(): Promise<boolean> {
        const isClosed = await this.closeChannel();
        if (!isClosed) return false;
        return await this.closeConnection();
    }

    private async closeChannel(): Promise<boolean> {
        try {
            await this._channel?.close();
        } catch (err) {
            console.error(`Failed to close channel: ${err}`);
            return false;
        }
        this._channel = undefined;
        return true;
    }

    private async closeConnection(): Promise<boolean> {
        try {
            await this.connection?.close();
        } catch (err) {
            console.log(`Failed to close connection: ${err}`);
            return false;
        }
        this.connection = undefined;
        return true;
    }

    async publishMessage(message: TxDetails): Promise<void> {
        try {
            this.channel.sendToQueue('nnp-msg-queue', Buffer.from(JSON.stringify(message)), { persistent: true });
        } catch (err) {
            console.log(`Failed to publish message: ${err}`);
            throw new Error(err as string);
        }
    }
}