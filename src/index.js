import { Promise$ } from "./promise$";

new Promise$(resolve => resolve(2)).then((value) => console.log(value))
