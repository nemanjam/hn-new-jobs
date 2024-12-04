export class Singleton {
  private static instances: Map<string, any> = new Map();

  public static getInstance<T>(className: string, createInstance: () => T): T {
    if (!Singleton.instances.has(className)) {
      Singleton.instances.set(className, createInstance());
    }

    return Singleton.instances.get(className) as T;
  }
}
