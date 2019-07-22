import React from 'react'
import PokemonCollection from './PokemonCollection'
import PokemonForm from './PokemonForm'
import { Search } from 'semantic-ui-react'
import _ from 'lodash'

class PokemonPage extends React.Component {
  constructor(props){
    super(props)
    this.state={
      pokemon: [],
      results: [],
      value: '',
      filterType: 'standard'
    }
  }
  
  componentDidMount(){
    fetch('http://localhost:3000/pokemon')
    .then(response => response.json())
    .then((pokemon) => this.setState({pokemon}))
  }

  handleSearchChange = (e, {value}) => {
    e.persist()
    this.setState({value})

    setTimeout(() => {
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.name)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.pokemon, isMatch),
      })
    }, 300)
  }

  handleAddPokemon = (pokemonData) => {
    let name = pokemonData.name
    let stats= [{value:pokemonData.hp, name:'hp'}]
    let sprites = {}
    sprites['front'] = pokemonData.frontUrl
    sprites['back'] = pokemonData.backUrl
    
    let reqObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({name, stats, sprites})
    }

    fetch('http://localhost:3000/pokemon', reqObj)
    .then(response => response.json())
    .then(pokeData => {
      const oldPokemon = this.state.pokemon
      this.setState({
        pokemon: [...oldPokemon, pokeData]
      })
    })
  }

  handleSelectChange = (e) => {
    this.setState({
      filterType: e.target.value
    }, this.handleUpdatedFilter)
  }

  handleUpdatedFilter = () => {
    if (this.state.filterType === 'name'){
      const nameSortedPokemon = this.state.pokemon.sort(this.compareName);
      this.setState({
        pokemon: nameSortedPokemon
      })
    } else if (this.state.filterType === 'standard') {
      const idSortedPokemon = this.state.pokemon.sort(this.compareIDNum);
      this.setState({
        pokemon: idSortedPokemon
      })
    } else if (this.state.filterType === 'hp') {
      const hpSortedPokemon = this.state.pokemon.sort(this.compareHP);
      this.setState({
        pokemon: hpSortedPokemon
      })
    }
  }

  compareName = (a, b) => {
    let nameA = a.name
    let nameB = b.name
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
    return 0;
    }
  }

  compareIDNum = (a, b) => {
    let idNumA = a.id
    let idNumB = b.id
    if (idNumA < idNumB) {
      return -1;
    } else if (idNumA > idNumB) {
      return 1;
    } else {
    return 0;
    }
  }


  compareHP = (a, b) => {
    let hpA = a.stats.find( (stat) => stat.name === 'hp').value
    let hpB = b.stats.find( (stat) => stat.name === 'hp').value
    if (hpA < hpB) {
      return -1;
    } else if (hpA > hpB) {
      return 1;
    } else {
    return 0;
    }
  }

  render() {
    return (
      <div>
        <h1>Pokemon Searcher</h1>
        <br />
        <Search onSearchChange={_.debounce(this.handleSearchChange, 500, {
           leading: true,
           })} showNoResults={false} value={this.state.value} results={this.state.results}/>
        <br />
        <div style={{margin: 2 + 'em'}}>
          <label>Filter By:</label>
          <select onChange={(e) => {this.handleSelectChange(e)}}>
            <option value='standard'>Pokedex ID Number</option>
            <option value='name'>Name</option>
            <option value='hp'>Will to Live</option>
          </select>
        </div>
        <br />
        <PokemonCollection pokemon={this.state.pokemon} results={this.state.results}/>
        <br />
        <PokemonForm handleAddPokemon={this.handleAddPokemon}/>
      </div>
    )
  }
}

export default PokemonPage
