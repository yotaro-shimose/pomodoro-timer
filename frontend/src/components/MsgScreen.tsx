import { FC } from 'react';

interface MsgScreenProps {
    msg: string,
}

const MsgScreen: FC<MsgScreenProps> = (props) => {
    return (
        <h1>{props.msg}</h1>
    )
};

export default MsgScreen;