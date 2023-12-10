import { init, fetchQuery } from "@airstack/airstack-react";
init(process.env.AIRSTACK_API_KEY);
export default async function handler(req, res) {
  const { address } = req.query;
  //   0x3882371e9Ca68eC62F3695Fd0083cB5D3ec17984
  console.log(address);

  const query = `
  query GetTokenTransfersFromAddressOnBase {
    baseTransfers: TokenTransfers(
      input: {
        filter: {
          _or: [{ from: { _eq: "${address}" } }, { to: { _eq: "${address}" } }]
        }
        blockchain: base
        limit: 100
      }
    ) {
      TokenTransfer {
        amount
        blockNumber
        blockTimestamp
        from {
          addresses
        }
        to {
          addresses
        }
        tokenAddress
        transactionHash
        tokenId
        tokenType
        blockchain
      }
    }
  }
`;
  try {
    const { data, error } = await fetchQuery(query);
    if (error) {
      console.log(error);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
    res.status(200).json({ statusCode: 200, data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}