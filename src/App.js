import { useState } from "react";

function App() {
  const [showData, setShowData] = useState(null);
  const [imgList, setImgList] = useState(null);
  const [showIndexNumber, setShowIndexNumber] = useState(0);

  const changeUIComp = <div>
    <button onClick={
      () => {
        let index = showIndexNumber - 1;
        if (index < 0) {
          index = imgList.length - 1;
        }
        setShowIndexNumber(index);
        setShowData(imgList[index]);
      }
    }>←</button>
    <button onClick={
      () => {
        let index = showIndexNumber + 1;
        index %= imgList.length;
        setShowIndexNumber(index);
        setShowData(imgList[index]);
      }
    }>→</button>
    <button onClick={
      () => {
        let index = Math.trunc(Math.random() * imgList.length);
        setShowIndexNumber(index);
        setShowData(imgList[index]);
      }
    }>RANDOM</button>
  </div>

  const getFiles = async (dh) => {
    let list = []
    for await (let [name, handle] of dh) {
      switch (handle.kind) {
        case 'file':
          let fileData = await handle.getFile();
          switch (fileData.type) {
            case 'image/gif':
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
              list.push({
                data: URL.createObjectURL(await handle.getFile()),
                name: name,
              })
              break;
          }
          break;
        case 'directory':
          list = list.concat(await getFiles(await dh.getDirectoryHandle(handle.name)))
          break;
      }
    }
    return list;
  }

  return (
    <div style={{
      textAlign: 'center',
      backgroundColor: '#aaa',
      height: '100vmin'
    }}>
      {
        showData ? <dir>
          <img
            src={showData.data}
            height={800}
            width={'auto'}
          />
          <p style={{
            borderRadius: '100px',
            backgroundColor: 'black',
            padding: '10px',
            color: 'white',
            fontStyle: 'bold',
            display: 'block',
          }}>{`${showData.name} ${showIndexNumber+1}/${imgList.length}`}</p>
        </dir> : null
      }
      {showData ? changeUIComp : null}
      <button onClick={async () => {
        try {
          let list = await getFiles(await window.showDirectoryPicker())
          setImgList(list);
          setShowIndexNumber(0);
          setShowData(list[0]);
        } catch (e) {
          console.log(e);
        }
      }}>ディレクトリを選択</button>
    </div>
  );
}

export default App;
