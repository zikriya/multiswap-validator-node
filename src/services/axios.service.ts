var axios = require("axios").default;
import {
  createAuthTokenForMultiswapBackend,
  BEARER,
} from "../constants/constants";

export let getTransactions = async function () {
  try {
    let baseUrl = (global as any as any).AWS_ENVIRONMENT
      .BASE_URL_MULTISWAP_BACKEND;
    if (process.env.ENVIRONMENT == "local") {
      baseUrl = "http://localhost:8080";
    }
    let config = {
      headers: {
        Authorization: BEARER + createAuthTokenForMultiswapBackend(),
      },
    };
    let url = `${baseUrl}/api/v1/transactions/list?status=generatorSignatureCreated&address=${process.env.PUBLIC_KEY}&limit=20&nodeType=validator`;
    let res = await axios.get(url, config);
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
      Authorization: BEARER + createAuthTokenForMultiswapBackend(),
    },
  };
  return axios.put(
    `${baseUrl}/api/v1/transactions/update/from/validator/${txHash}?address=${process.env.PUBLIC_KEY}`,
    body,
    config
  );
};
