import { PrismaClient } from '@prisma/client';
import { startStream, types } from 'near-lake-framework';
import { transactionParser } from './parser/parser';
import { RabbitMqConnection } from './rabbitMQ/setup';

const lakeConfig: types.LakeConfig = {
  s3BucketName: "near-lake-data-mainnet",
  s3RegionName: "eu-central-1",
  startBlockHeight: 78368075,
};

class NotificationService  {
    private rabbitMqConnection: RabbitMqConnection;
    private prisma: PrismaClient;

    constructor(_rabbitMqConnection: RabbitMqConnection) {
        this.rabbitMqConnection = _rabbitMqConnection;
        this.prisma = new PrismaClient();
    }

    handleStreamerMessage = async(
        streamerMessage: types.StreamerMessage
      ): Promise<void> => {
          const { block, shards } = streamerMessage;
          const blockHeight = block.header.height;
          const timestamp = new Date(block.header.timestamp/1000);

          // Parse transactions
          // Do something with the block and shards
          const transactions = shards.map((shard) => shard.chunk?.transactions ? shard.chunk?.transactions : []).reduce((a, b) => a.concat(b), []);
          if (transactions && transactions.length > 0) {
              transactions.forEach(async (tx) => {
                await transactionParser(tx, timestamp, this.rabbitMqConnection)
              });
              
          }

          // this.prisma.blockHeight.upsert({
          //   where: {
          //       network: "MAINNET"
          //   },
          //   update: {
          //     lastProcessedBlock: blockHeight,
          //   },
          //   create: {
          //     lastProcessedBlock: blockHeight,
          //     network: "MAINNET"
          //   }
          // })
      }
}


(async () => {
    const rabbitMqConnection = new RabbitMqConnection();
    await rabbitMqConnection.setUp()
    // await rabbitMqConnection.channel.consume("nnp-msg-queue", (msg) => console.log("listening", msg?.content.toString()));

    // const prisma = new PrismaClient();
    // const lastProcessedBlock = await prisma.blockHeight.findFirst({ where: { network: "MAINNET" } });
    const notificationService = new NotificationService(rabbitMqConnection);

    // lakeConfig.startBlockHeight = lastProcessedBlock?.lastProcessedBlock || 77072188;
    await startStream(lakeConfig, notificationService.handleStreamerMessage);
})();