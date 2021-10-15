const fs = require("fs")
const csvParser =  require("./csvParser")

const DATA_KEYS = {
  diseases:"diseases",
  people:"people",
  tests:"tests"
};

const files = {};
files[DATA_KEYS.diseases] = "./infectiousdiseases.csv";
files[DATA_KEYS.people]="./people.json";
files[DATA_KEYS.tests] = "./testReport.json";
  

const projectRawData = Object.entries(files).map( entry => {
  const data = fs.readFileSync(entry[1],{encoding:"utf8"})
  return {id:entry[0], data}
})

let peopleOnPlane = projectRawData.find((item) => item.id === DATA_KEYS.people).data
peopleOnPlane = JSON.parse(peopleOnPlane);

let tests = JSON.parse(projectRawData.find((item) => item.id === DATA_KEYS.tests).data)

let diseases = csvParser(projectRawData.find((item) => item.id === DATA_KEYS.diseases).data,";").slice(1)

let found = [];
let exceptions = [];
const DATA_FIELD_LENGHT_DISEASES = 4;
for(disease of diseases){

  const diseaseDNA = disease[disease.length-1];
  if(disease.length != DATA_FIELD_LENGHT_DISEASES){
    exceptions.push(disease)
  }

  for(test of tests.testData){
   if (test.testData.indexOf(diseaseDNA) != -1){
     found.push({disease, test});
   } 
  }

}

const sickPeople = [];
for(sick of found){
  const person peopleOnPlane.find( person => person.id === sick.test.id);
  sickPeople.push({name:person.name, disease:sick.disease[1]});
}


let report = {
  diseases:[...new Set(found.map(disease => disease.disease[0]))],
  sickPeople
}




