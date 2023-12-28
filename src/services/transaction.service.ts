import { axiosService, web3Service } from "./index";
import { removeTransactionHashFromLocalList } from "../crons/transactionsJob";
import { JobRequestBody } from "../interfaces/index";
import { getThreshold } from "../constants/constants";
import { signatureService } from "./index";

export async function fetchChainDataFromNetwork(tx: any) {
  if (tx) {
    let sourceNetwork = tx.sourceNetwork;
    let destinationNetwork = tx.destinationNetwork;
    let sourceRpc = sourceNetwork.multiswapNetworkFIBERInformation.rpcUrl;
    let destinationRpc =
      destinationNetwork.multiswapNetworkFIBERInformation.rpcUrl;

    let data: JobRequestBody = {
      name: "",
      isSourceNonEVM: sourceNetwork.isNonEVM,
      destinationRpcURL: destinationRpc,
      isDestinationNonEVM: destinationNetwork.isNonEVM,
      bridgeAmount: tx.bridgeAmount,
      txId: tx.receiveTransactionId,
      threshold: sourceNetwork.threshold,
      sourceAssetType: tx.sourceAssetType,
      destinationAssetType: tx.destinationAssetType,
      destinationAmountIn: tx.destinationAmountIn,
      destinationAmountOut: tx.destinationAmountOut,
      sourceOneInchData: tx.sourceOneInchData,
      destinationOneInchData: tx.destinationOneInchData,
      expiry: tx.signatureExpiry,
      targetToken: tx.destinationCabn.tokenContractAddress,
      sourceChainId: sourceNetwork.chainId,
      destinationChaibId: destinationNetwork.chainId,
      slippage: tx.slippage,
    };

    let job: any = { data: data, transaction: tx };
    if (job.data.isSourceNonEVM) {
      // console.log("======================");
      // console.log("source is Non EVM");
      // job.returnvalue = await cosmWasmService.getTransactionReceipt(
      //   job.data.txId,
      //   job.data.sourceRpcURL
      // );
    } else {
      console.log("====================== source is EVM");
      job.returnvalue = await web3Service.getTransactionReceipt(
        job.data.txId,
        job.data.sourceChainId,
        getThreshold(job.data.threshold)
      );
    }

    if (job?.returnvalue?.status == true) {
      await verifyAndCreateSignature(job);
    } else {
      console.info(`failed!`);
      removeTransactionHashFromLocalList(job?.data?.txId);
    }
  }
}

async function verifyAndCreateSignature(job: any) {
  try {
    let decodedData;
    let tx: any = {};
    let signedData;
    if (job.data.isSourceNonEVM != null && job.data.isSourceNonEVM) {
      // decodedData = cosmWasmService.getLogsFromTransactionReceipt(job);
      // tx.from = decodedData.from;
      // tx.hash = job.returnvalue.transactionHash;
    } else {
      decodedData = web3Service.getLogsFromTransactionReceipt(job);
      tx = await web3Service.getTransactionByHash(
        job.data.txId,
        job.data.sourceChainId
      );
    }
    console.info("decodedData", decodedData);

    if (job.data.isDestinationNonEVM != null && job.data.isDestinationNonEVM) {
      // let sd = await cosmWasmService.signedTransaction(job, decodedData, tx);
      // if (cosmWasmService.validateSignature(job, sd.signatures)) {
      //   signedData = sd;
      // }
    } else {
      let validateHashes = await web3Service.signedTransaction(
        job,
        decodedData,
        tx,
        true
      );
      if (signatureService.validateSignature(job, validateHashes.signatures)) {
        signedData = await web3Service.signedTransaction(
          job,
          decodedData,
          tx,
          false
        );
      }
    }

    await updateTransaction(job, signedData, tx);
  } catch (error) {
    console.error("error occured", error);
  }
}

async function updateTransaction(job: any, signedData: any, tx: any) {
  try {
    console.log("signedData", job?.returnvalue?.status, signedData);
    await axiosService.updateTransaction(job?.data?.txId, {
      signedData,
      transaction: tx,
      transactionReceipt: job?.returnvalue,
    });
    removeTransactionHashFromLocalList(job?.data?.txId);
  } catch (error) {
    console.error("error occured", error);
  }
}

export const getGeneratorHash = (tx: any): string => {
  try {
    let signatures = tx?.generatorSig?.signatures;
    if (signatures?.length > 0) {
      let signature = signatures[0];
      console.log("signature.hash", signature.hash);
      return signature.hash;
    }
  } catch (e) {
    console.log(e);
  }
  return "";
};
