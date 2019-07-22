import React from 'react'
import { Card } from 'semantic-ui-react'

class PokemonCard extends React.Component {

  constructor(props){
    super(props)
    this.state={
      image_src: this.props.pokemon.sprites.front,
      isClicked: false
    }
  }

  findHP = () => {
    const hp = this.props.pokemon.stats.find((pokeData) => pokeData.name === 'hp')
    return hp.value
  }

  updateImageSrc = () => {
    this.setState({
      isClicked: !this.state.isClicked
    })
    if (this.state.isClicked) {
      this.setState({
        image_src: this.props.pokemon.sprites.back
      })
    } else {
      this.setState({
        image_src: this.props.pokemon.sprites.front
      })
    }
  }

  
  render() {
    return (
      <Card>
        <div onClick={this.updateImageSrc}>
          <div className="image">
            <img src={this.state.image_src} alt={`${this.props.pokemon.name}`} />
          </div>
          <div className="content">
            <div className="header">{this.props.pokemon.name}</div>
          </div>
          <div className="extra content">
            <span>
              <i className="icon heartbeat red" />
              {this.findHP()} HP
            </span>
          </div>
        </div>
      </Card>
    )
  }
}

export default PokemonCard
