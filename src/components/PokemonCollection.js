import React from 'react'
import PokemonCard from './PokemonCard'
import { Card } from 'semantic-ui-react'
import { Z_FILTERED } from 'zlib';

class PokemonCollection extends React.Component {
  renderPokeCards = () => {
    if (this.props.results.length === 0){
      return this.props.pokemon.map((singlePokemon) => {
        return <PokemonCard pokemon={singlePokemon} key={singlePokemon.id}/>
      })
    } else {
      const filteredPoke = this.props.pokemon.filter((singlePokemon) => {
        return this.props.results.includes(singlePokemon)
      })
      return filteredPoke.map((singlePokemon) => {
        return <PokemonCard pokemon={singlePokemon} key={singlePokemon.id}/>
      })
    }
  }
  
  render() {
    return (
      <Card.Group itemsPerRow={6}>
        <h1>Hello From Pokemon Collection</h1>
        {this.renderPokeCards()}
      </Card.Group>
    )
  }
}

export default PokemonCollection
