import { exec as shellExec } from "shelljs";


/**
 * Wraps the shelljs.exec command to add logging and error handling. 
 *
 * @export
 * @param {string} command - The command to execute (please maintain shell/windows-command compatibility whenever possible)
 * @returns The result of the executed command
 */
export function exec(command: string){
  console.log(command);
  const result = shellExec(command);
  console.log(result.stdout);

  if (result.code !== 0) {
    console.error(result.stderr);
    throw new Error(result.stderr.trim());
  }

  return result;
}