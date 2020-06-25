import React,{useEffect,useState,useContext} from 'react';
import { useParams,useHistory} from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Card from '../../shared/components/UIElements/Card';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {AuthContext} from '../../shared/components/context/auth-context';


const UpdatePlace = () => {

    const auth = useContext(AuthContext);
    const placeId = useParams().placeId;
    const {isLoading , error , sendRequest , clearError} = useHttpClient();
    const [loadedPlace,setLoadedPlace] = useState();
    const history = useHistory();

    const[formState,inputHandler, setFormData] = useForm({
        title:{
            value:'',
            isValid : false
        },
        description:{
            value:'',
            isValid: false
        }
    },false);

    useEffect(()=>{
        const fetchPlace = async () =>{
            try{
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
                setLoadedPlace(responseData.place);

                setFormData({
                    title:{
                        value: responseData.place.title,
                        isValid: true
                    },
                    description:{
                        value: responseData.place.description,
                        isValid: true
                    }
                },true);

            }catch(err){

            }

        };
        fetchPlace();
    },[sendRequest,placeId]);

    const placeupdatesSubmitHandlter = async (event) => {
        event.preventDefault();

        try{
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
            'PATCH',
            JSON.stringify({
                title:formState.inputs.title.value,
                description:formState.inputs.description.value
            }),
            {
                'Content-Type':'application/json',
                Authorization :'Bearer '+ auth.token
            }
            );
            history.push('/'+auth.userId+'/places');
        }catch(err){

        }

    };


    if(isLoading){
        return (
            <div className="center">
                    <LoadingSpinner />
            </div>
        );
    }

    if(!loadedPlace && !error){
        return (
            <div className="center">
                <Card>
                <h2>Could not find Place!</h2>
                </Card>
                    
            </div>
        );
    }



    return (
        <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {!isLoading && loadedPlace && (<form className="place-form" onSubmit={placeupdatesSubmitHandlter}>
        <Input 
        id="title" 
        element="input" 
        type="text" 
        label="Title" 
        validators={[VALIDATOR_REQUIRE()]} 
        errorText = "Please enter a valid title."
        onInput={inputHandler}
        value={loadedPlace.title}
        valid={true}
        />
        <Input 
        id="description" 
        element="textarea" 
        label="Description" 
        validators={[VALIDATOR_MINLENGTH(5)]} 
        errorText = "Please enter a valid description (min 5 chars)."
        onInput={inputHandler}
        value={loadedPlace.description}
        valid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>)}
        </React.Fragment>
    );
}

export default UpdatePlace;