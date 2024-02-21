import { useState } from "react";
import { Button } from '@mui/material';
import { getFiles, searchDirectory } from "./FileSearch";

function App() {
  const [showData, setShowData] = useState(null);
  const [imgList, setImgList] = useState(null);
  const [showIndexNumber, setShowIndexNumber] = useState(0);
  const [mirror, changeMirrorFlag] = useState(false);

  const changeUIComp = <div style={{
    padding: 10
  }}>
    <Button variant='contained' onClick={
      () => {
        let index = showIndexNumber - 1;
        if (index < 0) {
          index = imgList.length - 1;
        }
        setShowIndexNumber(index);
        setShowData(imgList[index]);
      }
    }>←</Button>
    <Button variant='contained' onClick={
      () => {
        let index = showIndexNumber + 1;
        index %= imgList.length;
        setShowIndexNumber(index);
        setShowData(imgList[index]);
      }
    }>→</Button>
    <Button variant='contained' onClick={
      () => {
        let index = Math.trunc(Math.random() * imgList.length);
        setShowIndexNumber(index);
        setShowData(imgList[index]);
      }
    }>RANDOM</Button>
    <Button variant='contained' onClick={
      () => {
        changeMirrorFlag(!mirror);
      }
    }>MIRROR</Button>
  </div>

  return (
    <div style={{
      textAlign: 'center',
      backgroundColor: '#aaa',
      height: '100vmin'
    }}>
      {
        showData ? <div>
          <div style={{
            transform: `scale(${mirror ? -1 : 1}, 1)`
          }}>
            <img
              src={showData.data}
              height={800}
              width={'auto'}
            />
          </div>
          <p style={{
            borderRadius: '100px',
            backgroundColor: 'black',
            padding: '10px',
            color: 'white',
            fontStyle: 'bold',
            display: 'block',
          }}>{`${showData.name} ${showIndexNumber+1}/${imgList.length}`}</p>
        </div> : null
      }
      {showData ? changeUIComp : null}
      <Button variant='contained' onClick={async () => {
        try {
          let list = await getFiles(await searchDirectory())
          setImgList(list);
          setShowIndexNumber(0);
          setShowData(list[0]);
        } catch (e) {
          console.log(e);
        }
      }}>ディレクトリを選択</Button>
    </div>
  );
}

export default App;
