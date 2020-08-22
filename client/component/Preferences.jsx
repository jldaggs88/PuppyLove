import React, { useState, useEffect } from 'react';
import { Link, Route } from 'react-router-dom';
import axios from 'axios';
import { Row, Col } from "react-bootstrap";

function Preferences({ open, filterDogs, setIndex, setFilter }) {

  const options = {
    maxAge: null,
    minAge: null,
    breed: null
  }

  return (
    <div className="prefs">
    <button id='settings' onClick={open}>Menu</button>
      <div>
        Set preferences for the dogs you want to see.
      </div>
      <div className="form-group">
						<label htmlFor="">Min Age:</label>
						<input type="text" name="city" className="form-control" onChange={(e) => {options.minAge = e.target.value}}/>
					</div>
					<div className="form-group">
						<label htmlFor="">Max Age:</label>
						<input type="text" name="area" className="form-control" onChange={(e) => options.maxAge = e.target.value}/>
					</div >
          <div className="form-group">
						<label htmlFor="">Breed:</label>
						<input type="text" name="area" className="form-control" onChange={(e) => options.breed = e.target.value}/>
					</div >
          <button onClick={() => {
        console.log('setting', options)
        setFilter(options)
        filterDogs(options);
        setIndex(0);
        }} text='Submit'>Submit</button>
    </div>
  );
};

export default Preferences;
 