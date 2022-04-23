import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, Slider } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import "./App.css";


function App() {
  const[pinged, setPinged] =  useState(false);
  const[getTable, setGetTable]= useState();
  const [data, setData] = useState([]);
  const [url, setUrl] = useState('');
  const [packeges, setPackeges] = useState(15);
  const [pingResponse, setPingResponse] = useState("");
  const [pingErrResponse, setPingErrResponse] = useState("");



  /// here add a post fetch to the server with url + packeges
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {setData(data);
        setGetTable();
        console.log(data);}
      )
      setTimeout(() => {setGetTable(true)}, 10000);
  }, [getTable]);


  // useEffect(() => {

  //   fetch("/ping", {
  //     method: 'POST', // or 'PUT'
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({url: url, packeges: packeges}),
  //   })
  //    .then((response) => response.json())
  //   .then((data) => {
  //     console.log('Success:', data);
  //     setPingResponse(data.pingRes);
  //     setPingErrResponse(data.pingErr);
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
  // }, [url, packeges]);

  
  const handleHost = e => {
    setUrl(e.target.value)
  };

  const handlePackets = number => {      
    setPackeges(number)
  };

  const handleSubmit = (e) => {
    setPinged(false);
    setPingResponse("");
    setPingErrResponse("");
    fetch("/ping", {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: url, packeges: packeges}),
    })
     .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      setPingResponse(data.pingRes);
      setPingErrResponse(data.pingErr);
      setGetTable(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    setPinged(true);
  };

  const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
  };


  const Table = () => {
    return (
    <table id="customers">
      <tr>
        <th>URL</th>
        <th>Count</th>
        
      </tr>
      {data.map(d => (
        <tr>
          <td>{d.url}</td>
          <td>{d.count}</td>
        </tr>
        ))}
    </table>
    );
  
  }

 
  return (
    <div className="App">
      <header className="App-header">
        {/* <p>{!pingResponse ? "Loading..." : pingResponse}</p>
        <p>{!pingErrResponse ? "" : pingErrResponse}</p> */}
         <h1 color="">Ping Form</h1>
        <Form 
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            >
            
           
            <p className='labeled'>Choose a host to ping with number of packeges.</p>
            <br></br>
            <Form.Item
             name="host"
            rules={[
          {
            required: true,
            message: 'Please enter host url',
          },
        ]}>
              <Input  onChange={handleHost} value={url} placeholder='place host URL here' style = {{ borderColor: "indianred"}}></Input>
                {/* <TextArea rows={10} onChange={handleText} value={text} placeholder='Please write your feedback here'/> */}
            </Form.Item>
            <Form.Item>
                {/* <Rate onChange={handleRate} /> */}
                <Slider onChange={handlePackets} defaultValue={15} min={1} max={30}  trackStyle = {{ background: "indianred" }} handleStyle= {{ background: "indianred" , borderColor: "white"}} />
            </Form.Item>
            <br></br>
            <Form.Item>
                <Button type="primary" htmlType="submit" danger ghost>
                PING
                </Button>
            </Form.Item>
            <Form.Item>
            <TextArea rows={4} placeholder='The ping result will appear here' value={pinged && !pingResponse && !pingErrResponse ? "loading..." : pingResponse || pingErrResponse}></TextArea>
              </Form.Item>
            </Form>
            {/* {<p>{!pingResponse && !pingErrResponse ? "Loading..." : pingResponse || pingErrResponse}</p>} */}
           
            <p> Top Pinged Hosts </p>
            { Table()}
         
              
      </header>

      
    </div>
  );
}

export default App;