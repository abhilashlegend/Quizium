import classes from './ErrorHandler.module.css'
import Card from './Card';
import { useRouteError, useNavigate } from 'react-router-dom';

export default function ErrorHandler(props) {

    const error = useRouteError();

    const navigate = useNavigate();

    let title = 'An error occured';

    let message = "Something went wrong!";

    if(error.status === 500){
        message = error.data.message;
    }

    if(error.status === 422){
        message = error.data.message;
    }

    if(error.status === 404){
        title = 'Not found!';
        message = 'Could not find resource or page.'
    }

    function closeHandler() {
        navigate('..');
    }

    return (
        <>
            <div className={classes.backdrop} onClick={closeHandler}></div>
            <Card className={classes.modal}>
                <div className={classes.header}>
                    <h2>{title}</h2>    
                </div>
                <div className={classes.content}>
                    <p>{message}</p>    
                </div>   
                <footer className={classes.actions}>
                    <div>
                        <button className='main-button' type="button" onClick={closeHandler}>Ok</button>    
                    </div>    
                </footer> 
            </Card>        
        </>
    )
}