import { startStream, types } from 'near-lake-framework';
import { transactionParser } from './parser/parser';

const lakeConfig: types.LakeConfig = {
  s3BucketName: "near-lake-data-mainnet",
  s3RegionName: "eu-central-1",
  startBlockHeight: 77072188,
};

class NotificationService  {
    async handleStreamerMessage(
        streamerMessage: types.StreamerMessage
      ): Promise<void> {
          const { block, shards } = streamerMessage;
          const blockHeight = block.header.height;
          const timestamp = new Date(block.header.timestamp/1000);

          // Do something with the block and shards
          const transactions = shards.map((shard) => shard.chunk?.transactions ? shard.chunk?.transactions : []).reduce((a, b) => a.concat(b), []);
          if (transactions && transactions.length > 0) {
              transactions.forEach((tx) => {
                transactionParser(tx, timestamp)
              });
          }
          console.log(`Block ${blockHeight} processed`);
      }
}


(async () => {
    const notificationService = new NotificationService();
    await startStream(lakeConfig, notificationService.handleStreamerMessage);
})();