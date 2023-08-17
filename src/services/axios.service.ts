var axios = require("axios").default;

export let getTransactions = async function () {
  try {
    let baseUrl = (global as any as any).AWS_ENVIRONMENT
      .BASE_URL_MULTISWAP_BACKEND;
    if (process.env.ENVIRONMENT == "local") {
      baseUrl = "http://localhost:8080";
    }
    let url = `${baseUrl}/api/v1/transactions/list?status=generatorSignatureCreated&address=${process.env.PUBLIC_KEY}&isPagination=false&limit=1`;
    let res = await axios.get(url);
    return res.data.body.transactions;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateTransactionJobStatus = async (txHash: string, body: any) => {
  let baseUrl = (global as any as any).AWS_ENVIRONMENT
    .BASE_URL_MULTISWAP_BACKEND;
  if (process.env.ENVIRONMENT == "local") {
    baseUrl = "http://localhost:8080";
  }
  let config = {
    headers: {
      Authorization: "",
    },
  };
  return axios.put(
    `${baseUrl}/api/v2/transactions/update/swap/and/withdraw/job/${txHash}?isFrom=validator&address=${process.env.PUBLIC_KEY}`,
    body,
    config
  );
};
