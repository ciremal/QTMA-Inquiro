import { Box, Modal } from "@mui/material";
import { inter } from "../ui/fonts";

interface TranscriptModalProps {
  transcript: { name: string; sentence: string }[];
  open: boolean;
  setOpen: any;
  ticker: string;
}

const TranscriptModal = ({
  transcript,
  open,
  setOpen,
  ticker,
}: TranscriptModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "75%",
          bgcolor: "var(--secondaryBlack)",
          border: "2px solid var(--primaryGray)",
          p: 4,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          overflow: "auto",
          maxHeight: "90%",
        }}
      >
        <div className={`text-4xl mb-5 ${inter.className} text-white`}>
          {ticker} 2024 Q4 Earnings Call Transcript
        </div>
        {transcript.map((item: any, index: number) => {
          return (
            <div key={index}>
              <p className={`${inter.className} text-lg text-white`}>
                <span className="font-semibold">{item.name}:</span>{" "}
                <span className="font-light">{item.sentence}</span>
              </p>
              <br></br>
            </div>
          );
        })}
      </Box>
    </Modal>
  );
};

export default TranscriptModal;
