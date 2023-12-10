import Example from '@/components/sidebar'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useRef, useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const headers = [
    { label: "Transaction hash", key: "hash" },
    { label: "Token Type", key: "tokenType" },
    { label: "Token Address", key: "tokenAddress" },
    { label: "From", key: "from" },
    { label: "To", key: "to" },
    { label: "Amount", key: "value" },
    { label: "Timestamp", key: "timestamp" },
  ];

  const csvRef = useRef();

  const downloadReport = async () => {
    // console.log(data)
    csvRef.current.link.click();
  };

  const pullData = async (address) => {
    try {
      setError(false);
      setLoading(true);

      const requestInfo = await axios.get(`/api/compliance/${address}`);
      console.log(requestInfo);
      const requestData = requestInfo.data;

      const { TokenTransfer } = requestData.data.baseTransfers;
      console.log(TokenTransfer);

      let dataArr = [];

      for (let i = 0; i < TokenTransfer?.length; i++) {
        const {
          transactionHash,
          tokenType,
          tokenAddress,
          from,
          to,
          amount,
          blockTimestamp,
        } = TokenTransfer[i];

        let value = amount / 10 ** 18;

        dataArr.push({
          hash: transactionHash,
          tokenType: tokenType,
          tokenAddress: tokenAddress,
          from: from.addresses[0],
          to: to.addresses[0],
          value: value,
          timestamp: blockTimestamp,
        });
      }
      console.log(dataArr);
      setData(dataArr);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    pullData("0x3882371e9Ca68eC62F3695Fd0083cB5D3ec17984");
  }, []);

  if (isConnected)
    return (
<div>
      <Example />

      {loading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="p-4">
          <h1 className="text-3xl font-extrabold p-4">Taxes</h1>
          <table class="table-auto p-4">
            <thead>
              <tr>
                <th className="px-4 sm:px-6">Transaction hash</th>
                <th className="px-4 sm:px-6">Token Type</th>
                <th className="px-4 sm:px-6">Token Address</th>
                <th className="px-4 sm:px-6">From</th>
                <th className="px-4 sm:px-6">To</th>
                <th className="px-4 sm:px-6">Amount</th>
                <th className="px-4 sm:px-6">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, i) => {
                return (
                  <tr key={i}>
                    <td className="underline px-4 sm:px-6">
                      <a href={`https://basescan.org/tx/${item?.hash}`}>
                        {item?.hash?.substring(0, 6)}...
                        {item?.hash?.substring(58, 64)}
                      </a>
                    </td>
                    <td>{item?.tokenType}</td>
                    <td className="underline px-4 sm:px-6">
                      <a
                        href={`https://basescan.org/address/${item?.tokenAddress}`}
                      >
                        {item?.tokenAddress?.substring(0, 6)}...
                        {item?.tokenAddress?.substring(38, 42)}
                      </a>
                    </td>
                    <td className="underline px-4 sm:px-6">
                      <a href={`https://basescan.org/address/${item?.from}`}>
                        {item?.from?.substring(0, 6)}...
                        {item?.from?.substring(38, 42)}
                      </a>
                    </td>
                    <td className="underline px-4 sm:px-6">
                      <a href={`https://basescan.org/address/${item?.to}`}>
                        {item?.to?.substring(0, 6)}...
                        {item?.to?.substring(38, 42)}
                      </a>
                    </td>
                    <td>{item?.value}</td>
                    <td>{item?.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div>
            <div className="mb-3">
              <p className="font-bold text-white">Export your tax report:</p>
            </div>
            <button
              onClick={downloadReport}
              className={`bg-transparent text-white font-semibold py-4 px-12 border border-b-dark rounded-xl transform cursor-pointer active:scale-75 hover:bg-drumworks-dark hover:text-white ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              <p className="mb-0">Download</p>
            </button>
            <CSVLink
              headers={headers}
              data={data}
              filename={`Tax.csv`}
              ref={csvRef}
            />
          </div>
        </div>
      )}
    </div>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>
}
