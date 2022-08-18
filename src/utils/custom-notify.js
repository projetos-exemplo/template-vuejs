
import notify from 'devextreme/ui/notify';

const customNotify = (message, messageType) => notify({
    message: message,
    position: 'top right',
    direction: 'down-push',
    maxWidth: '100%',
    width: window.innerWidth
}, messageType, 3500);

export default customNotify; 