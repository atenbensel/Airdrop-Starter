import { useState } from "react";
import Image from "next/image";
import { useCSVReader } from "react-papaparse";
import { ethers } from "ethers";

type AirdropUploadProps = {
  setAirdrop: Function;
};

const AirdropUpload = ({ setAirdrop }: AirdropUploadProps) => {
  const { CSVReader } = useCSVReader();
  const [success, setSuccess] = useState(false);

  const isValidAirdrop = (airdrop: string[]) => {
    const airdropArray = [];
    try {
      if (airdrop.length < 1)
        throw `The csv file must contain at least 1 record.`;
      for (let i = 0; i < airdrop.length; i++) {
        const address = airdrop[i][0];
        const quantity = Number(airdrop[i][1]) || 1;

        if (!ethers.utils.isAddress(address)) {
          if (i <= 0) continue;
          throw `Invalid address at line ${i + 1}.`;
        }
        if (typeof address != "string")
          throw `Invalid address at line ${i + 1}.`;

        for (let j = 0; j < quantity; j++) {
          airdropArray.push(address);
        }
      }
    } catch (error) {
      console.error(`There was a problem with the airdrop: ${error}`);
      return false;
    }

    return airdropArray;
  };

  const onUploadAccepted = (results: any) => {
    const newAirdrop = results.data;
    const valid = isValidAirdrop(newAirdrop);
    if (valid) {
      setAirdrop(valid.toString());
      setSuccess(true);
    } else {
      setAirdrop(null);
      setSuccess(false);
    }
  };

  return (
    <CSVReader
      onUploadAccepted={onUploadAccepted}
      config={{ dynamicTyping: true, skipEmptyLines: true }}
    >
      {({ getRootProps, acceptedFile }: any) => (
        <>
          <label {...getRootProps()}>
            <div className="relative cursor-pointer w-full flex items-center border border-gray-400 border-dashed rounded-md mt-3 gap-3 px-4 py-2">
              <div className="relative flex items-center">
                {acceptedFile && success ? (
                  <Image
                    title=""
                    height={30}
                    width={30}
                    src="/icons/success.png"
                    alt="nft image"
                  />
                ) : (
                  <Image
                    title=""
                    height={59}
                    width={68}
                    src="/icons/audio-placeholder.png"
                    alt="nft image"
                  />
                )}
              </div>
              <div>
                <p className="upload-header">Upload Airdrop List</p>
                <p className="upload-subtext">
                  csv{" "}
                  <a
                    href="/examples/airdrop.csv"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="underline"
                  >
                    download template
                  </a>
                </p>
              </div>
            </div>
          </label>
        </>
      )}
    </CSVReader>
  );
};

export default AirdropUpload;
