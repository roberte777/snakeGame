import { useState, useEffect, useRef } from "react";
import Learner from "../public/Learner";
import styles from "../styles/Home.module.css";
class Node {
  constructor(x, y, next) {
    this.x = x;
    this.y = y;
    this.next = next;
  }
}

function updateSnake(startx, starty, headNode) {
  var tempx = startx;
  var tempy = starty;
  var curr = headNode.next;

  while (curr != null) {
    let temptempx = curr.x;
    let temptempy = curr.y;
    curr.x = tempx;
    curr.y = tempy;
    tempx = temptempx;
    tempy = temptempy;
    curr = curr.next;
  }
}
const Jeffrey = new Learner();
var dir = [10, 0];

export default function Home() {
  var count = -1;
  const [lost, setLost] = useState(false);
  const [paused, setPaused] = useState(true);
  const [snake, setSnake] = useState(new Node(0, 0));
  const [food, setFood] = useState([]);
  const [score, setScore] = useState(0);
  const [games, setGames] = useState(0);
  //   const [direction, setDirection] = useState([0, 10]);

  useEffect(() => {
    generateFood();
    Jeffrey.save();
  }, []);
  //   useEffect(() => {
  //     document.addEventListener("keydown", changeDirection);
  //     return () => document.removeEventListener("keydown", changeDirection);
  //   }, [direction]);
  useEffect(() => {
    if (!paused && !lost) {
      const interval = setInterval(moveSnake, 100);

      return () => clearInterval(interval);
    }
  }, [snake, paused]);

  function moveSnake() {
    let currHead = new Node(snake.x, snake.y, snake.next);
    var tempx = currHead.x;
    var tempy = currHead.y;
    const direction = Jeffrey.act(display(), food);
    // if (
    //   direction[0] != (dir[0] == 0 ? 0 : dir[0] * -1) ||
    //   direction[1] != (dir[1] == 0 ? 0 : dir[1] * -1)
    // ) {
    //   dir = direction;
    // }
    currHead.x += direction[0];
    currHead.y += direction[1];
    let curr = currHead.next;
    // while (curr != null) {
    //   if (currHead.x == curr.x && currHead.y == curr.y) {
    //     setLost(true);
    //     Jeffrey.updateQValues(true);
    //     reset();
    //   }
    //   curr = curr.next;
    // }
    // if (currHead.x < 0 || currHead.x >= 600) {
    //   setLost(true);
    //   Jeffrey.updateQValues(true);
    //   reset();
    // }
    // if (currHead.y < 0 || currHead.y >= 600) {
    //   setLost(true);
    //   Jeffrey.updateQValues(true);
    //   reset();
    // }
    if (currHead.x == food[0] && currHead.y == food[1]) {
      currHead.next = snake;
      setScore(score + 1);
      setSnake(currHead);
      generateFood();
    } else {
      updateSnake(tempx, tempy, currHead);
      setSnake(currHead);
    }
    while (curr != null) {
      if (currHead.x == curr.x && currHead.y == curr.y) {
        setLost(true);
        Jeffrey.updateQValues(true);
        reset();
      }
      curr = curr.next;
    }
    if (currHead.x < 0 || currHead.x >= 600) {
      setLost(true);
      Jeffrey.updateQValues(true);
      reset();
    }
    if (currHead.y < 0 || currHead.y >= 600) {
      setLost(true);
      Jeffrey.updateQValues(true);
      reset();
    }
  }

  function generateFood() {
    let num1 = Math.floor(Math.random() * 60) * 10;
    let num2 = Math.floor(Math.random() * 60) * 10;
    setFood([num1, num2]);
  }

  function reset() {
    setLost(false);
    setSnake(new Node(0, 0));
    generateFood();
    Jeffrey.reset();
    if (games > 50) {
      Jeffrey.epsilon = 0.05;
    }
    if (games > 100) {
      Jeffrey.epsilon = 0;
    }
    setScore(0);
    setGames(games + 1);
  }
  function display() {
    var node = snake;
    var array = [];
    while (node != null) {
      array.push(node);
      node = node.next;
    }
    return array;
  }

  return (
    <>
      <div>
        {" "}
        Score: {score} Games: {games}
      </div>
      <div className={styles.container}>
        {display().map((node) => {
          let color = ["red", "blue", "orange", "purple", "aqua"];
          count += 1;
          return (
            <div
              className={styles.snake}
              style={{
                top: node.y,
                left: node.x,
                backgroundColor: color[count] ? color[count] : "black",
              }}
              key={count}
            ></div>
          );
        })}

        {/* <div className={styles.snake} style={{ top: snake.x, left: snake.y }} /> */}
        <div
          className={styles.food}
          style={{ top: food[1], left: food[0] }}
        ></div>
      </div>
      <button
        onClick={() => {
          setPaused(!paused);
        }}
      >
        {paused ? "Play" : "Pause"}
      </button>
      <button
        onClick={() => {
          reset();
        }}
      >
        Reset
      </button>
      <div>{paused}</div>
    </>
  );
}
