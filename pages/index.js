import { useState, useEffect, useRef } from "react";
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

export default function Home() {
  var count = -1;
  const [lost, setLost] = useState(false);
  const [paused, setPaused] = useState(true);
  const [snake, setSnake] = useState(new Node(0, 0));
  const [food, setFood] = useState([]);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState([0, 10]);
  const directionRef = useRef(direction);
  const setDirectionRef = (data) => {
    directionRef.current = data;
    setDirection(data);
  };
  useEffect(() => {
    generateFood();
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", changeDirection);
    return () => document.removeEventListener("keydown", changeDirection);
  }, [direction]);
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
    currHead.x += direction[0];
    currHead.y += direction[1];
    let curr = currHead.next;
    while (curr != null) {
      if (currHead.x == curr.x && currHead.y == curr.y) {
        setLost(true);
      }
      curr = curr.next;
    }
    if (currHead.x < 0 || currHead.x >= 600) {
      setLost(true);
    }
    if (currHead.y < 0 || currHead.y >= 600) {
      setLost(true);
    }
    if (currHead.x == food[0] && currHead.y == food[1]) {
      currHead.next = snake;
      setScore(score + 1);
      setSnake(currHead);
      generateFood();
    } else {
      updateSnake(tempx, tempy, currHead);
      setSnake(currHead);
    }
  }

  function generateFood() {
    let num1 = Math.floor(Math.random() * 60) * 10;
    let num2 = Math.floor(Math.random() * 60) * 10;
    setFood([num1, num2]);
  }
  function changeDirection(event) {
    console.log(direction);
    switch (event.keyCode) {
      case 39:
        if (direction[0] != 0 || direction[1] != -10) {
          setDirection([0, 10]);
        }
        break;
      case 37:
        if (direction[0] != 0 || direction[1] != 10) {
          setDirection([0, -10]);
        }
        break;
      case 38:
        if (direction[0] != 10 || direction[1] != 0) {
          setDirection([-10, 0]);
        }
        break;
      case 40:
        if (direction[0] != -10 || direction[1] != 0) {
          setDirection([10, 0]);
        }
        break;
      default:
        break;
    }
  }
  function reset() {
    setLost(false);
    setPaused(true);
    setSnake(new Node(0, 0));
    generateFood();
    setDirection([0, 10]);
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
      <div> Score: {score}</div>
      <div className={styles.container}>
        {display().map((node) => {
          let color = ["red", "blue", "orange", "purple", "aqua"];
          count += 1;
          return (
            <div
              className={styles.snake}
              style={{
                top: node.x,
                left: node.y,
                backgroundColor: color[count] ? color[count] : "black",
              }}
              key={count}
            ></div>
          );
        })}

        {/* <div className={styles.snake} style={{ top: snake.x, left: snake.y }} /> */}
        <div
          className={styles.food}
          style={{ top: food[0], left: food[1] }}
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
