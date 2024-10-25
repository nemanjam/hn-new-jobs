
export const sleep = async (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));
