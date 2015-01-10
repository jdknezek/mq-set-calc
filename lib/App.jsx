import _ from 'lodash';
import React from 'react/addons';

var App = React.createClass({
  getInitialState() {
    var skills = {};
    this.props.sets.forEach(set => set.skills.forEach(skill => skills[skill] = null));

    var filters = {
      skills: [null, null, null],
      distance: '',
      rare: true
    };

    return {
      skills: _(skills).keys().sortBy(),
      filters,
      calculated: null,
      displayed: []
    };
  },

  skillChanged(index) {
    return (event) => {
      var skills = this.state.skills.slice();
      skills[index] = event.target.value;

      var update = {skills: []};
      update.skills[index] = {$set: event.target.value || null};

      var filters = React.addons.update(this.state.filters, update);
      this.setState({
        filters,
        calculated: null
      });
    };
  },

  distanceChanged(event) {
    var filters = React.addons.update(this.state.filters, {distance: {$set: event.target.value}});
    this.setState({
      filters,
      calculated: null
    });
  },

  rareChanged(event) {
    var filters = React.addons.update(this.state.filters, {rare: {$set: event.target.checked}});
    this.setState({
      filters,
      calculated: null
    });
  },

  formSubmitted(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.state.calculated) {
      this.setState({displayed: _.sortBy(this.state.calculated, set => [
        set.distance,
        set.weapon.DISTANCE,
        set.armor.DISTANCE,
        set.pet.DISTANCE
      ])});
    } else {
      var distance = parseFloat(this.state.filters.distance, 10);
      var skills = _(this.state.filters.skills).filter().sort().valueOf();

      this.setState({
        filters: React.addons.update(this.state.filters, {distance: {$set: isNaN(distance) ? '' : distance.toFixed(1)}}),
        calculated: _(this.props.sets)
          .filter(set =>
            (isNaN(distance) || set.distance <= distance) &&
            (!set.pet.RARE || this.state.filters.rare))
          .filter(set => {
            var setIndex = 0;

            for (var i = 0; i < skills.length; i++) {
              var matched = false;
              for (var j = setIndex; j < set.skills.length; j++) {
                if (set.skills[j] === skills[i]) {
                  matched = true;
                  setIndex = j + 1;
                  break;
                }
              }
              if (!matched) {
                return false;
              }
            }

            return true;
          })
          .valueOf()
      });
    }
  },

  render() {
    return <div>
      <form className="form-horizontal" onSubmit={this.formSubmitted}>
        {_.range(3).map(i => <div key={'skill-' + (i + 1)} className="form-group">
          <label htmlFor={'skill-' + (i + 1)} className="col-sm-2 control-label">Skill {i + 1}:</label>
          <div className="col-sm-10">
            <select id={'skill-' + (i + 1)} className="form-control" onChange={this.skillChanged(i)}>
              <option/>
              {this.state.skills.map(skill => <option key={skill}>{skill}</option>)}
            </select>
          </div>
        </div>)}

        <div className="form-group">
          <label htmlFor="distance" className="col-sm-2 control-label">Max Distance:</label>
          <div className="col-sm-10">
            <input id="distance" type="text" className="form-control" value={this.state.filters.distance} onChange={this.distanceChanged}/>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="rare" className="col-sm-2 control-label">Rare:</label>
          <div className="col-sm-10">
            <div className="checkbox">
              <label>
                <input id="rare" type="checkbox" checked={this.state.filters.rare} onChange={this.rareChanged}/>
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12" style={{textAlign: 'right'}}>
            {this.state.calculated ?
              <button type="submit" className="btn btn-primary">Display <strong>{this.state.calculated.length}</strong> set{this.state.calculated.length === 1 ? '' : 's'}</button> :
              <button type="submit" className="btn btn-primary">Calculate sets</button>}
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped table-hover table-condensed">
          <thead>
            <tr>
              <th>Distance</th>
              <th>Weapon</th>
              <th>Armor</th>
              <th>Pet</th>
              <th>Skill 1</th>
              <th>Skill 2</th>
              <th>Skill 3</th>
              <th>Rare</th>
            </tr>
          </thead>
          <tbody>
            {this.state.displayed.map(set => <tr key={set.weapon.WEAPON + '/' + set.armor.ARMOR + '/' + set.pet.PET}>
              <td>{set.distance.toFixed(1)}</td>
              <td>{set.weapon.WEAPON}</td>
              <td>{set.armor.ARMOR}</td>
              <td>{set.pet.PET}</td>
              <td>{set.skills[0]}</td>
              <td>{set.skills[1]}</td>
              <td>{set.skills[2]}</td>
              <td>{set.pet.RARE && '\u2713'}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
  }
});

export default App;
