export default interface IGenericRepository<T> {
    findById(id: string): Promise<T | null>;
    findByField(field: Partial<T>): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
  }