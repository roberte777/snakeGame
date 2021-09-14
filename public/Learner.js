export default class Learner {
  constructor() {
    this.epsilon = 0.1;
    this.lr = 0.1;
    this.discount = 0.5;
    this.qvalues = this.loadQValues();
    this.history = [];
    this.directions = [
      [0, 10],
      [-10, 0],
      [10, 0],
      [0, -10],
    ];
    this.prevdir = [];
  }

  reset() {
    this.history = [];
  }
  loadQValues() {
    var horizontal, vert, walls;
    var state = {};
    horizontal = [0, 1, 2];
    vert = [0, 1, 2];
    horizontal.forEach((hor) => {
      vert.forEach((ver) => {
        for (let i = 0; i < 16; i++) {
          state["" + hor + "" + ver + "" + i] = [0.25, 0.25, 0.25, 0.25];
        }
      });
    });

    return state;
  }
  act(snake, food) {
    var currState = this.getState(snake, food);
    var rand = Math.random();
    var index;
    var action;
    if (rand < this.epsilon) {
      index = Math.floor(Math.random() * 4);
      action = this.directions[index];
      // if (this.prevdir.length > 0) {
      //   if (
      //     (action == [0, 10] && this.prevdir == [0, -10]) ||
      //     (action == [0, -10] && this.prevdir == [0, 10]) ||
      //     (action == [10, 0] && this.prevdir == [-10, 0]) ||
      //     (action == [-10, 0] && this.prevdir == [10, 0])
      //   ) {
      //     var temp = index;
      //     while (temp == index) {
      //       temp = Math.floor(Math.random() * 4);
      //       action = this.directions[index];
      //     }
      //     index = temp;
      //   }
      // }
    } else {
      var qValue = this.qvalues[currState];
      index = qValue.indexOf(Math.max(...qValue));
      action = this.directions[index];
      //   if (this.prevdir.length > 0) {
      //     console.log(Math.imul(this.prevdir[0], -1));
      //     if (
      //       action[0] == Math.imul(this.prevdir[0], -1) &&
      //       action[1] == Math.imul(this.prevdir[1], -1)
      //     ) {
      //       console.log(
      //         "starting action: ",
      //         action,
      //         " prevdir: ",
      //         this.prevdir,
      //         Math.imul(this.prevdir[0], -1)
      //       );

      //       var greatestIdx = index == 0 ? 1 : 0;
      //       var greatest = qValue[greatestIdx];
      //       this.qvalues[currState].forEach((e, idx) => {
      //         if (e >= greatest && idx != index) {
      //           greatest = e;
      //           greatestIdx = idx;
      //         }
      //       });
      //       action = this.directions[greatestIdx];
      //       index = greatestIdx;
      //     }
      //   }
    }
    var snakeX = snake[0].x;
    var snakeY = snake[0].y;
    var snakeDistance = Math.abs(snakeX - food[0]) + Math.abs(snakeY - food[1]);
    this.history.push({
      state: currState,
      action: index,
      distance: snakeDistance,
    });
    this.prevdir = action;
    console.log(
      action,
      this.history,
      currState,
      this.qvalues[currState],
      snake
    );
    // console.log(this.history, action);
    return action;
  }
  getState(snake, food) {
    var snakeX = snake[0].x;
    var snakeY = snake[0].y;
    //0 = food is on right
    //1 food is on left
    var horizontal = snakeX - food[0] < 0 ? 0 : snakeX - food[0] == 0 ? 2 : 1;
    //1 = food is below
    //0 food is above
    var vert = snakeY - food[1] < 0 ? 1 : snakeY - food[1] == 0 ? 2 : 0;
    var walls = [];
    this.directions.forEach((direction) => {
      var check = [snake[0].x + direction[0], snake[0].y + direction[1]];
      var tempSnake = snake;
      console.log(tempSnake);
      // check = JSON.stringify(check);
      // tempSnake = JSON.stringify(tempSnake);
      var test = false;
      tempSnake.forEach((link) => {
        if (link.x == check[0] && link.y == check[1]) {
          test = true;
        }
      });
      if (test || this.checkBoundary(check)) {
        walls.push(1);
      } else {
        walls.push(0);
      }
    });
    var state = walls[0] * 8 + walls[1] * 4 + walls[2] * 2 + walls[3] * 1;
    return "" + horizontal + "" + vert + "" + state;
  }
  checkBoundary(coordinate) {
    // console.log("checking", coordinate);
    if (
      coordinate[0] < 0 ||
      coordinate[1] < 0 ||
      coordinate[0] >= 600 ||
      coordinate[1] >= 600
    ) {
      return true;
    } else {
      return false;
    }
  }

  updateQValues(reason) {
    for (var i = this.history.length - 1; i >= 0; i--) {
      // console.log(reason);
      if (reason) {
        var sN = this.history[i]["state"];
        var aN = this.history[i]["action"];
        var reward = -1;
        this.qvalues[sN][aN] =
          (1 - this.lr) * this.qvalues[sN][aN] + this.lr * reward;
        reason = null;
      } else {
        var s1 = this.history[i]["state"];
        var a1 = this.history[i]["action"];
        var s0 = this.history[i + 1]["state"];
        // var a0 = this.history[i + 1]["action"];
        var d1 = this.history[i].distance;
        var d2 = this.history[i + 1].distance;
        if (d2 == 0) {
          reward = 1;
        } else if (d2 < d1) {
          reward = 1;
        } else {
          reward = -1;
        }
        var state_str = s0;
        var new_state_str = s1;
        this.qvalues[s1][a1] =
          (1 - this.lr) * this.qvalues[s1][a1] +
          this.lr * (reward + this.discount * Math.max(...this.qvalues[s0]));
      }
    }
  }
}

// def UpdateQValues(self, reason):
//     history = self.history[::-1]
//     for i, h in enumerate(history[:-1]):
//         if reason: # Snake Died -> Negative reward
//             sN = history[0]['state']
//             aN = history[0]['action']
//             state_str = self._GetStateStr(sN)
//             reward = -1
//             self.qvalues[state_str][aN] = (1-self.lr) * self.qvalues[state_str][aN] + self.lr * reward # Bellman equation - there is no future state since game is over
//             reason = None
//         else:
//             s1 = h['state'] # current state
//             s0 = history[i+1]['state'] # previous state
//             a0 = history[i+1]['action'] # action taken at previous state

//             x1 = s0.distance[0] # x distance at current state
//             y1 = s0.distance[1] # y distance at current state

//             x2 = s1.distance[0] # x distance at previous state
//             y2 = s1.distance[1] # y distance at previous state

//             if s0.food != s1.food: # Snake ate a food, positive reward
//                 reward = 1
//             elif (abs(x1) > abs(x2) or abs(y1) > abs(y2)): # Snake is closer to the food, positive reward
//                 reward = 1
//             else:
//                 reward = -1 # Snake is further from the food, negative reward

//             state_str = self._GetStateStr(s0)
//             new_state_str = self._GetStateStr(s1)
//             self.qvalues[state_str][a0] = (1-self.lr) * (self.qvalues[state_str][a0]) + self.lr * (reward + self.discount*max(self.qvalues[new_state_str])) # Bellman equation
