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
      value: ''
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

  render() {
    return (
      <div>
        <h1>Pokemon Searcher</h1>
        <br />
        <Search onSearchChange={_.debounce(this.handleSearchChange, 500, {
           leading: true,
           })} showNoResults={false} value={this.state.value} results={this.state.results}/>
        <br />
        <PokemonCollection pokemon={this.state.pokemon} results={this.state.results}/>
        <br />
        <PokemonForm handleAddPokemon={this.handleAddPokemon}/>
      </div>
    )
  }
}

export default PokemonPage
