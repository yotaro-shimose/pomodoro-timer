import { FC } from "react";

// // Material UI
// import Radio from "@material-ui/core/Radio";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormControl from "@material-ui/core/FormControl";
// import FormLabel from "@material-ui/core/FormLabel";
// import Button from "@material-ui/core/Button";

// interface RadioItem {
//   id: string;
//   value: any;
// }

// interface RadioFormProps {
//   label: string;
//   items: RadioItem[];
//   onChange: (event?: React.ChangeEvent<HTMLInputElement>) => void;
//   defaultId: string;
// }

// const RadioForm: FC<RadioFormProps> = (props) => {
//   return (
//     <FormControl component="label">
//       <FormLabel component="label">Select Task List</FormLabel>
//       <RadioGroup name="TaskList" value={state.taskListId} onChange={props.onChange}>
//         {props.taskListList.map((taskList, idx) => {
//           return (
//             <FormControlLabel
//               key={idx}
//               value={taskList.id}
//               control={<Radio />}
//               label={taskList.summary}
//               checked={taskList.id === state.taskListId}
//             />
//           );
//         })}
//       </RadioGroup>
//       <Button onClick={nextStep}>Next</Button>
//     </FormControl>
//   );
// };
