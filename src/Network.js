const { default: axios } = require("axios");

function getTransactions() {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(
        "https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json"
      );
console.log(result);
      resolve(result.data);
    } catch (error) {
      reject(error);
    }
  });
}
module.exports = { getTransactions };
