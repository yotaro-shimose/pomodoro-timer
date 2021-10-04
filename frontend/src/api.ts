import { Config } from './interfaces';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userIdState } from './atoms';
import { BackendURL } from './constants';
export const useSendConfig = () => {
    const userId = useRecoilValue(userIdState);
    const sendConfig = (config: Config) => {
        axios.post(`${BackendURL}/config`, config, {
            headers: {
                'Content-Type': 'x-www-form-urlencoded',
                userId: userId
            }
        })
    }
    return sendConfig;
};