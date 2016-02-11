var soul_levels = [10, 20, 40, 70, 95, 130];
var stomach = [];

var stats = {
  race: "Goblin",
  rank: 1,
  growth: 1,
  soul_level: 1,
  curr_exp: 0,
  next_exp: soul_levels[0],
  eaten: 0,
  full: 3,
  update: function () {
      this.test();
      var race = "Race: " + this.race + "<br>";
      var rank = "Rank: " + this.rank + "<br>";
      var growth = "Growth: " + this.growth + "<br>";
      var level = "Soul-Level: " + this.soul_level + "<br>";
      var exp = "Soul-Exp: " + this.curr_exp + " / " + this.next_exp + "<br>";
      var stomach = "Eaten: " + this.eaten + " / " + this.full + "<br>";
      var templ = race + rank + level + exp + stomach + growth;
      $(".stats").html(templ);
    },

  test: function () {
      if (this.curr_exp > this.next_exp) {
        this.soul_level++;
        this.next_exp = soul_levels[this.soul_level-1];
      }
      if (this.eaten >= this.full) {
        this.eaten = 0;
        this.growth++;
        player.digest();
        updatePlayer(player);
      }
  }
};

var Monster = {
  atk : 0, speed : 0, health : 0
};

var player = Object.create(Monster);
player.atk = 10;
player.health = 70;
player.speed = 5;
player.name = "ClownCombat";
player.level = 1;
player.getMaxHealth = function () {
  return 70 + stats.growth * 5;
};
player.digest = function() {
  var hp = 0, atk = 0, speed = 0;
  stomach.forEach(function (i) {
    hp += i[0];
    atk += i[1];
    speed += i[2];
  });
  this.health += hp;
  if ( this.health > this.getMaxHealth())
  this.health = this.getMaxHealth();
  this.atk += atk;
  this.speed += speed;
  stomach = [];
};


monster_factory = function(race_num, level) {
  switch(race_num) {
    case 0:
      return Rabbit(level);
    case 1:
      return Cat(level);
    case 2:
      return Dog(level);
    default:
  }
};



function Rabbit(level) {
   if (level === undefined) {
     level = 1;
   }
   var obj = Object.create(Monster);
   obj.name = "Rabbit";
   obj.health = 20 + level/3;
   obj.atk = 3 + level/5;
   obj.speed = 3;
   obj.digest= [5, 0, 0.3];
   return obj;
}

function Cat(level) {
   if (level === undefined) {
     level = 1;
   }
   var obj = Object.create(Monster);
   obj.name = "Cat";
   obj.health = 30 + 2 * (level/3);
   obj.atk = 7 + level/5;
   obj.speed = 9 + level/4;
   obj.digest = [4, 0.5, 0.7];
   return obj;
}

function Dog(level) {
   if (level === undefined) {
     level = 1;
   }
   var obj = Object.create(Monster);
   obj.name = "Dog";
   obj.health = 50 + 3 * (level/3);
   obj.atk = 9 + level/4;
   obj.speed = 7 + level/4;
   obj.digest = [8, 1.2, 0.4];
   return obj;
}

function updateEnemy(obj) {
  var name = "Name: " + obj.name;
  var health = "Hp: " + Math.round(obj.health);
  var atk = "Atk: " + Math.round(obj.atk);
  var speed = "Speed: " + Math.round(obj.speed);
  var templ = name + "<br>" + health + " --- " + atk + " --- " + speed +"<br>";
  $(".enemy").html(templ);
}

function updatePlayer(obj) {
  var name = "Name: " + obj.name;
  var health = "Hp: " + Math.round(obj.health);
  var atk = "Atk: " + Math.round(obj.atk);
  var speed = "Speed: " + Math.round(obj.speed);
  var templ = name + "<br>" + health + " --- " + atk + " --- " + speed +"<br>";
  $(".player").html(templ);
}

function nextInt(x) {
  return parseInt(Math.random(42) * x);
}

function init() {
  curr = monster_factory(0, nextInt(player.level + 2));
  updateEnemy(curr);
  updatePlayer(player);
  stats.update();
}

init();


// SPeed => Bonus Atk if difference big enough
function first() {
  bonus = 0;
  if (player.speed > curr.speed) {
    return 1;
  }

  if (player.speed > 2*curr.speed) {
    return 3;
  }
  return bonus;
}

function fight() {
    bonus = first();
    curr.health -= Math.round(player.atk) + bonus;
    if (curr.health <= 0) {
      curr.health = 0;
    }

    player.health -= Math.round(curr.atk);
    if (player.health <= 0) {
      player.health = player.getMaxHealth();
    }

  updateEnemy(curr);
  updatePlayer(player);
  if(curr.health === 0) {
    stats.eaten++;
    stomach.push(curr.digest);
    stats.curr_exp++;
    stats.update();
    curr = monster_factory(nextInt(3), nextInt(player.level + 2));
    updateEnemy(curr);
  }
}
