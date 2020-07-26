let globalUsers = [];
let globalCountries = [];
let globalUserContries = [];

const start = async () => {
  await fetchCountries();
  await fetchUsers();
  
  mergeUsersCountries();
  render();
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
      name: user.name.first,
      avatar: user.picture.large,
      country: user.nat
    })
  })
  globalUsers = [...filteredUser];
}

const mergeUsersCountries =  () => {
  globalUserContries = globalUsers.map((user)=>{
    const country = globalCountries.find(country => country.country === user.country);
    return (
      {
        ...user, 
        ...country
      }
    )
  });
}

const render = () =>{
  const divCard = document.querySelector('.menu');
  divCard.innerHTML = `
    ${globalUserContries.map(({name,avatar,countryFlag,countryName})=>{
      return(
        `<div class="card">
          <img src="${avatar}" alt="countryName">
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



start();




