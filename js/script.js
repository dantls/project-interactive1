let globalUsers = [];
let globalCountries = [];
let globalUserContries = [];
let globalFilteredUser = [];

async function start() {

  //"Normal"
  // await fetchCountries();
  // await fetchUsers();

  //"Sequencial com medidor"
  // console.time('promise');
  // await promiseCountries();
  // await promiseUsers();
  // console.timeEnd('promise');

  const p1 = promiseUsers();
  const p2 = promiseCountries();
  console.time('promise');
  await Promise.all([p1,p2]);
  console.timeEnd('promise');
  hideSpinner();
  mergeUsersCountries();
  render();
  filterUser();
}

function hideSpinner(){
  const spinner = document.querySelector('.loader');
  spinner.classList.add('displayNone');
}

function promiseUsers(){
  return new Promise (async(resolve, reject) => {
    const users = await fetchUsers();
    setTimeout(() => {
      resolve(users);      
    }, 3000);
  })
}
function promiseCountries(){
  return new Promise (async(resolve, reject) => {
    const countries = await fetchCountries();
    setTimeout(() => {
      resolve(countries);      
    }, 3000);
  })
}


async function fetchCountries() {
  const resource = await fetch('http://localhost:3001/countries');
  const response = await resource.json();

  const filteredCountry = response.map(country =>{
    return({
      country: country.alpha2Code,
      countryName: country.name,
      countryFlag: country.flag,
    })
  });
  globalCountries = [...filteredCountry];
}
async function fetchUsers() {
  const resource = await fetch('http://localhost:3002/users');
  const response = await resource.json();

  const filteredUser = response.map(user =>{
    return({
      name: user.name.first+ ' ' + user.name.last,
      nameLowerCase: (user.name.first+ ' ' + user.name.last).toLowerCase().trim(),
      avatar: user.picture.large,
      country: user.nat
    })
  })
  globalUsers = [...filteredUser];
}

function mergeUsersCountries() {
  globalUserContries = globalUsers.map((user)=>{
    const country = globalCountries.find(country => country.country === user.country);
    return (
      {
        ...user, 
        ...country
      }
    )
  });

  globalUserContries.sort((a, b) => a.name.localeCompare(b.name));
  globalFilteredUser = [...globalUserContries];
}

function render () {
  const divCard = document.querySelector('.menu');
  divCard.innerHTML = `
    ${globalFilteredUser.map(({name,avatar,countryFlag,countryName})=>{
      return(
        `<div class="card">
          <img src="${avatar}" alt="${countryName}">
          <div class="info">
            <p>${name}</p>
            
            <div style="
              background-image:url(${countryFlag}); 
              background-size:cover;
              width:120px;
              height:80px;
              float:left;
              background-color:#fff;	
              display: initial;
              z-index: 5;
              overflow: hidden; " 
              class="flag"
            > </div>          
          </div>  
        </div>`
      )
    }).join('')} 
  `; 
}

function filterUser(){
  const search = document.querySelector('#search');
  const inputUser = document.querySelector('#userName');
  
  inputUser.addEventListener('keyup',handleKeyUp);
  search.addEventListener('click', handleButtonClick);

  
}

function handleKeyUp(event){
  handleButtonClick();

}


function handleButtonClick(){
  const inputUser = document.querySelector('#userName');
  const valueInput = inputUser.value.toLowerCase().trim();
 
  globalFilteredUser = globalUserContries.filter(user =>{
    return user.nameLowerCase.includes(valueInput);
  });
  render();

}


start();




