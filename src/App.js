import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  Tooltip,
  UncontrolledAccordion,
  UncontrolledTooltip,
} from "reactstrap";

import { useEffect, useState } from "react";
import gold from "../src/assets/img/gold.png";
import silver from "../src/assets/img/silver.png";
import bronze from "../src/assets/img/bronze.png";
import "../src/assets/css/style.css";
import moment from "moment";
import { createItem, updateItem } from "./services/firebase.service";
import { get, limitToFirst, off, query, ref, update } from "firebase/database";
import { db } from "./firebase";

function App() {
  const usersRef = ref(db, "users");

  const [speedChecker, setSpeedChecker] = useState("");
  const [total, setTotal] = useState(0);
  const [emoji, setEmoji] = useState("");

  const [myText, setMyText] = useState(
    "Lorem Ipsum is simply dummy text of the printing"
  );
  const [startTime, setStartTime] = useState(undefined);
  const [name, setName] = useState("");
  const [tableList, setTableList] = useState([]);
  const [levelList, setLevelList] = useState([
    {
      level: "Easy",
      content: "Lorem Ipsum is simply dummy text of the printing",
    },
    {
      level: "Medium",
      content:
        "When planning sentence fluency instruction, first work on the sentence part of sentence fluency by varying sentence lengths",
    },
    {
      level: "Hard",
      content:
        "Most readability formulas use the number of words in a sentence to measure its difficulty. Try to keep the average sentence length of your document around 20–25 words. This is a good rule of thumb to convey your meaning in a balanced way and avoiding a marathon or choppy sentences",
    },
    {
      level: "Coding",
      content:
        `<input style={{ display: "flex", margin: "8px -4px" }} />`,
    },
  ]);
  const [selectedLevel, setSelectedLevel] = useState("easy");

  useEffect(() => {
    // let arr = localStorage.getItem("speedChecker");
    // let localData = arr ? JSON.parse(arr) : [];
    // setTableList(localData);
    fetchData();
    return () => {
      off(usersRef);
    };
  }, []);

  const handleLevelChange = (e) => {
    const value = e.target.value;
    setSelectedLevel(value);

    const findedObj = levelList.find((v) => value == v.level);
    const content = findedObj.content;
    setMyText(content);
  };

  async function fetchData() {
    try {
      // await fetchTotalItems();
      const items = [];
      // const startIndex = (currentPage - 1) * itemsPerPage;
      const snapshot = await get(query(usersRef, limitToFirst(100)));
      snapshot.forEach((childSnapshot) => {
        items.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      const serializedData = items
        // .slice(0, itemsPerPage)
        // .sort((a, b) => b.createdAt - a.createdAt)
        .map((item) => ({
          ...item,
          createdAt: item?.createdAt
            ? moment(item.createdAt).format("DD.MM.YYYY HH:mm:ss")
            : "",
          // updatedAt: item?.updatedAt
          //   ? moment(item.updatedAt).format("DD.MM.YYYY HH:mm:ss")
          //   : "",
        }));

      setTableList(serializedData);
      setName("");
      setSpeedChecker("");
    } catch (error) {
      console.log("fetchData error: ", error);
    }
  }

  const handleSpeedChange = (e) => {
    console.log("qw", e);
    if (e.target.value == "") {
      setStartTime();
      setEmoji();
      setTotal();
    }

    let date = new Date();
    if (!startTime) {
      setStartTime(date.getTime());
    }

    setSpeedChecker(e.target.value);

    if (myText === e.target.value) {
      let x = date.getTime() - startTime;
      let sec = Math.floor((x / 1000) % 60);
      if (!speedChecker || !name) {
        alert("Please fill the required fields");
      } else {
        setTotal(sec);

        let result = sec / myText.length;

        setEmoji(result);

        let obj = {
          name: name,
          content: myText,
          second: sec,
          createdAt: Date.now(),
          level: selectedLevel,
        };

        // let arr = localStorage.getItem("speedChecker");

        // let localData = arr ? JSON.parse(arr) : [];

        let findedObj = tableList.find(
          (v) => v.content == myText && v.name == name
        );

        if (findedObj) {
          if (obj.second < findedObj?.second) {
            // tableList = tableList.filter(
            //   (v) => v.name !== obj.name || v.content !== obj.content
            // );

            // tableList.push(obj);

            updateItem("users", findedObj.id, { second: obj.second });

            setName("");
            setSpeedChecker("");
            fetchData();

            // localStorage.setItem("speedChecker", JSON.stringify(localData));

            // setTableList(localData);
          }
        } else {
          // localData.push(obj);
          createItem("users", obj);
          fetchData();

          // localStorage.setItem("speedChecker", JSON.stringify(localData));
          // setTableList(localData);
        }
      }
    }
  };

  let sortedList = tableList.sort(function (a, b) {
    return a.second - b.second;
  });

  const handlePrevent = (e) => {
    e.preventDefault();

    alert("Copy, Paste and Cut is prohibited!");
  };

  return (
    <div style={{ background: "#edf3ff", height: "100vh" }}>
      <div className="container">
        <h3 style={{ textAlign: "center", padding: "15px" }}>
          Writing speed checker 
        </h3>

        <Row>
          <Col
            md="4"
            style={{
              background: "#e1e1f8",
              borderRadius: "30px",
              padding: "20px",
            }}
          >
            <Row style={{ display: "flex" }}>
              <Col md="12">
                <FormGroup>
                  <Label for="exampleText">Content({myText.length})</Label>

                  <Input
                    type="select"
                    name="select"
                    onChange={handleLevelChange}
                  >
                    {levelList.map((v) => (
                      <option
                        key={v.level}
                        value={v.level}
                        style={{ textTransform: "capitalize" }}
                      >
                        {v.level}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="exampleText">Name</Label>
                  <Input
                    type="text"
                    name="text"
                    value={name}
                    maxlength="50"
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md="12">
                <FormGroup>
                  <Label for="exampleText">Write here</Label>
                  <Input
                    id="text"
                    type="textarea"
                    rows="6"
                    cols="50"
                    name="text"
                    onPaste={handlePrevent}
                    onCopy={handlePrevent}
                    onDrop={handlePrevent}
                    onCut={handlePrevent}
                    autocomplete="off"
                    value={speedChecker}
                    onChange={handleSpeedChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div>
              {Boolean(total) && (
                <p
                  style={{
                    background: "white",
                    width: "60%",
                    padding: "6px 21px",
                    borderRadius: "60px",
                    marginLeft: "80px",
                  }}
                >
                  Your Speed Time: {total} sec{" "}
                  {emoji < 0.3 ? (
                    <span>👌</span>
                  ) : emoji < 0.5 && emoji > 0.3 ? (
                    <span> 😐</span>
                  ) : (
                    <span> ☹️</span>
                  )}
                </p>
              )}
              <p class="unselectable" >{myText}</p>
            </div>
          </Col>
          <Col md="8">
            <Card style={{ borderRadius: "35px" }} className="card">
              <CardBody style={{ padding: "33px" }} className="scrolldown">
                
                <Table hover className="table-sm table-responsive">
                  <thead>
                    <tr style={{ background: "rgb(235 235 235 / 46%)" }}>
                      <th>#</th>
                      <th>Name</th>
                      <th>Content</th>
                      <th>Second</th>
                      <th>Level</th>
                      <th>CreatedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedList.map((v, i) => (
                      <tr>
                        <td>
                          {i + 1 == 1 ? (
                            <img src={gold} width={40} />
                          ) : i + 1 == 2 ? (
                            <img src={silver} width={40} />
                          ) : i + 1 == 3 ? (
                            <img src={bronze} width={40} />
                          ) : (
                            i + 1
                          )}
                        </td>

                        <td>{v?.name}</td>
                        <td>
                        
                       
                           
                        <p><span  href="#" id="UncontrolledTooltipExample">{`${v?.content.substr(0,50)}...`}</span>.</p>
      <UncontrolledTooltip placement="bottom" target="UncontrolledTooltipExample">
     
       {v?.content}
      
      </UncontrolledTooltip>

                           
                        </td>
                        <td>{v?.second}</td>
                        <td> {v?.level}</td>
                        <td>
                          {v?.createdAt
                            ? moment(v.createdAt).format("DD.MM.YYYY")
                            : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
