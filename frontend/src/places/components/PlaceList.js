import React from 'react';
import './PlaceList.css';
import PlaceItem from './PlaceItem';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
const PlaceList = (props) =>{

    if(props.items.length==0){
        return <div className="place-list center">
            <Card>
                <h2>No Place Found!</h2>
                <Button to="/places/new">SHARE PLACE</Button>
            </Card>
        </div>
    }

    return <ul className="place-list">
        {props.items.map(place => <PlaceItem 
        key={place.id} 
        id={place.id}
         title={place.title} 
         image={place.image}
         description = {place.description}
         address = {place.address}
         creatorId = {place.creator}
         coordinates = {place.location}
         onDelete = {place.onDeletePlace}
         />)}
    </ul>
};

export default PlaceList;