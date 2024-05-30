<template>
  <div class="container">
    <div class="left-panel">
      <h1>同盟對決</h1>
      <div v-if="showOriginalData">
        <button @click="showForm">加入同盟數據</button>
        <div v-for="(team, index) in teams" :key="index">
          <p>同盟 {{ team.code }} - 戰力: {{ team.strength }}</p>
        </div>
      </div>
      <select id="roundNumber" v-model="selectedRound">
        <option v-for="n in 5" :key="n" :value="n - 1">第 {{ n - 1 }}輪</option>
      </select>
      <label for="teamCodeSelect">要輸的隊伍代碼:</label>
      <select id="teamCodeSelect" v-model="selectedTeamCode">
        <option value="" selected>請選擇</option>
        <option v-for="team in teams" :key="team.code" :value="team.code">{{ team.code }}</option>
      </select>
      <button v-if="!tournamentStarted" @click="startTournament">開始計算</button>
      <button @click="clearResults">清除結果</button>
    </div>
    <div class="center-panel">
      <h2>4輪比賽結果</h2>
      <div v-if="tournamentResults.length > 0" class="grid-container">
        <div v-for="(round, roundIndex) in tournamentResults" :key="roundIndex" class="grid-item">
          <h3>Round {{ roundIndex + 1 }}</h3>
          <ul>
            <li v-for="(match, matchIndex) in round" :key="matchIndex">
              {{ match.team1.code }} vs {{ match.team2.code }} - Winner: {{ match.winner.code }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="right-panel">
      <h2>最後排名</h2>
      <div v-if="tournamentFinished">
        <ol>
          <li v-for="(team, index) in finalRanking" :key="index">
            <p>
              同盟 {{ team.code }} - 戰力: {{ team.strength }} - 勝場: {{ team.wins }} - 第幾輪贏: {{ team.roundsWon }}
            </p>
          </li>
        </ol>
      </div>
    </div>
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <span class="close" @click="hideForm">&times;</span>
        <h1 class="modal-title">Add Teams</h1>
        <form @submit.prevent="addTeams">
          <div v-for="(team, index) in 16" :key="index">
            <label :for="'teamCode_' + index">同盟 {{ index + 1 }} 代碼:</label>
            <input :id="'teamCode_' + index" v-model="newTeams[index].code" type="text">
            <label :for="'teamStrength_' + index">同盟 {{ index + 1 }} 戰力:</label>
            <input :id="'teamStrength_' + index" v-model="newTeams[index].strength" type="number">
          </div>
          <button type="submit" class="submit-button">Add Teams</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface Team {
  code: string;
  strength: number;
  wins: number;
  roundsWon: number;
}

interface MatchResult {
  team1: Team;
  team2: Team;
  winner: Team;
}

const newTeams = reactive(Array.from({ length: 16 }, () => ({ code: '', strength: 0 })) as Team[]);
const teams = reactive([] as Team[]);
const finalRanking = ref([] as Team[]);
const tournamentResults = ref([] as MatchResult[][]);
const tournamentStarted = ref(false);
const tournamentFinished = ref(false);
const showPopup = ref(false);
const showOriginalData = ref(true);
const selectedTeamCode = ref('');
const selectedRound = ref(0);

/*onMounted(() => {
  const teamData: Team[] = [
  ];

  teams.push(...teamData);
  showOriginalData.value = true;
});*/

const addTeams = () => {
  const maxLength = Math.max(...newTeams.map((team: Team) => team.strength.toString().length));
  const validTeams = newTeams.filter((team: Team) => team.code && team.strength > 0);

  validTeams.forEach((team: Team) => {
    const strengthString = team.strength.toString();
    const paddingLength = maxLength - strengthString.length;
    if (paddingLength > 0) {
      team.strength = parseInt('0'.repeat(paddingLength) + strengthString, 10);
    }
  });

  teams.push(...validTeams.map((team: Team) => ({ ...team, wins: 0, roundsWon: 0 })));
  newTeams.splice(0, newTeams.length, ...Array.from({ length: 16 }, () => ({ code: '', strength: 0, wins: 0, roundsWon: 0}))); // Clear newTeams array
  hideForm();
  showOriginalData.value = true;
};

const startTournament = () => {
  const tempTeams = [...teams];
  tournamentStarted.value = true;
  tournamentFinished.value = false;
  tournamentResults.value.splice(0, tournamentResults.value.length);
  const rounds = 4;
  for (let i = 0; i < rounds; i++) {
    reorderTeams();
    simulateRound();
  }
  teams.splice(0, teams.length, ...tempTeams);
  finalRanking.value = calculateFinalRanking([...tempTeams]);
  tournamentStarted.value = false;
  tournamentFinished.value = true;
  showOriginalData.value = true;
};

const simulateRound = () => {
  const roundResults: MatchResult[] = [];
  const losingTeams: Set<string> = new Set(); // 用于存储已经输掉比赛的队伍代号
  for (let i = 0; i < teams.length; i += 2) {
    const team1 = teams[i];
    const team2 = teams[i + 1];
    let matchWinner = team1.strength > team2.strength ? team1 : team2;

    if (selectedRound.value !== null && selectedTeamCode.value !== '') {
      const matchIndex = Math.floor(i / 2);
      if (matchIndex === selectedRound.value && (team1.code === selectedTeamCode.value || team2.code === selectedTeamCode.value)) {
        // 确保在指定轮次中选定的队伍只输一次
        if (!losingTeams.has(selectedTeamCode.value)) {
          matchWinner = team1.code === selectedTeamCode.value ? team2 : team1;
          losingTeams.add(selectedTeamCode.value);
        }
      }
    }

    const matchResult: MatchResult = {
      team1,
      team2,
      winner: matchWinner
    };
    roundResults.push(matchResult);
    matchWinner.wins++;
    matchWinner.roundsWon++;
  }
  tournamentResults.value.push(roundResults);
};

const reorderTeams = () => {
  if (tournamentResults.value.length > 0) {
    teams.sort((a: Team, b: Team) => {
      if (a.wins !== b.wins) {
        return b.wins - a.wins;
      } else {
        return b.roundsWon - a.roundsWon;
      }
    });
  }
};

const calculateFinalRanking = (teams: Team[]) => {
  const sortedTeams = [...teams];
  sortedTeams.sort((a: Team, b: Team) => {
    if (a.wins !== b.wins) {
      return b.wins - a.wins;
    } else {
      return a.roundsWon - b.roundsWon;
    }
  });
  return sortedTeams;
};

const showForm = () => {
  showPopup.value = true;
};

const hideForm = () => {
  showPopup.value = false;
};

const clearResults = () => {
  tournamentResults.value.splice(0, tournamentResults.value.length);
  finalRanking.value.splice(0, finalRanking.value.length);
  teams.splice(0, teams.length);
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: nowrap;
}

.left-panel,
.right-panel,
.center-panel {
  flex: 2;
  padding-right: 20px;
  white-space: nowrap;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}

.grid-item {
  border: 1px solid #ccc;
  padding: 10px;
}

.popup {
  display: block; /* 确保弹窗显示 */
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

button {
  border: 1px solid #000;
  padding: 5px 10px;
  cursor: pointer;
}

.modal-title {
  font-size: 40px;
}

.submit-button {
  color: #fff;
  background-color: #333;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  float: right;
}
</style>
