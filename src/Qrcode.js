import React, { useState } from "react";
import { TextField, Button, Container, Typography , Slider } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import DownloadIcon from '@mui/icons-material/Download';

function Qrcode() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [telephone, setTelephone] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState(null);

  const [qrCodeWidth, setQrCodeWidth] = useState(500); 
  const [qrCodeHeight, setQrCodeHeight] = useState(400);
  


  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name: name,
      surname: surname,
      telephone: telephone,
      height:qrCodeHeight,
      width:qrCodeWidth
    };

    try {
      const response = await axios.post("http://localhost:8080/api/v1/qr/qrcode", data, {
        responseType: "arraybuffer",
        params: {
            height: qrCodeHeight,
            width: qrCodeWidth,
          },
      });

      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
      setQrCodeImage(imageUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("QR Code Details:", 15, 35);
    const qrImage = new Image();
    qrImage.src = qrCodeImage;
    qrImage.onload = () => {
      doc.addImage(qrImage, "PNG", 30, 40, 120, 100);
      doc.save("qrcode.pdf");
    };
  };
  

  return (
    //style={{backgroundColor:"#CCFFE8"}}
    <div >
    <Container >
      <Typography variant="h4">QR Code Generator</Typography>
      <form onSubmit={handleSubmit}>
      <TextField
          label="Ad"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Soyad"
          variant="outlined"
          fullWidth
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Telefon Nömrəs"
          variant="outlined"
          fullWidth
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          margin="normal"
        />
       <div style={{ display: "flex", gap: "16px" }}>
            <div>
              <Typography gutterBottom>QR Code Eni</Typography>
              <Slider
                value={qrCodeWidth}
                onChange={(event, newValue) => setQrCodeWidth(newValue)}
                min={100}
                max={800}
                step={10}
                valueLabelDisplay="auto"
              />
            </div>
            <div>
              <Typography gutterBottom>QR Code Uzunlugu</Typography>
              <Slider
                value={qrCodeHeight}
                onChange={(event, newValue) => setQrCodeHeight(newValue)}
                min={100}
                max={800}
                step={10}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
        <Button type="submit" variant="contained" color="primary">
          Generate QR Code
        </Button>
      </form>
      {qrCodeImage && <img src={qrCodeImage} alt="Generated QR Code" />}
      {qrCodeImage && <Button onClick={generatePdf} variant="contained" endIcon={<DownloadIcon />}>
        Generate PDF
      </Button>}
    </Container>
    </div>
  );
}

export default Qrcode;


