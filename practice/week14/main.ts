// 인터페이스 정의
type UserRole = "USER" | "ADMIN";

interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
}

// 제네릭 API 응답 래퍼
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 제네릭 저장소 인터페이스 구현
interface Repository<T extends BaseEntity> {
  create(entity: Omit<T, keyof BaseEntity>): ApiResponse<T>;
  findAll(): ApiResponse<ReadonlyArray<T>>;
  update(id: string, patch: Partial<Omit<T, keyof BaseEntity>>): ApiResponse<T>;
  delete(id: string): ApiResponse<null>;
}

class InMemoryRepository<T extends BaseEntity> implements Repository<T> {
  private store = new Map<string, T>();

  create(entity: Omit<T, keyof BaseEntity>): ApiResponse<T> {
    const now = new Date();
    const created: T = {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...(entity as T)
    };
    this.store.set(created.id, created);
    return { success: true, data: created };
  }

  findAll(): ApiResponse<ReadonlyArray<T>> {
    return { success: true, data: Array.from(this.store.values()) };
  }

  update(id: string, patch: Partial<Omit<T, keyof BaseEntity>>): ApiResponse<T> {
    const curr = this.store.get(id);
    if (!curr) return { success: false, data: null as unknown as T, message: "데이터를 찾지 못했습니다." };
    const updated = { ...curr, ...patch, updatedAt: new Date() } as T;
    this.store.set(id, updated);
    return { success: true, data: updated };
  }

  delete(id: string): ApiResponse<null> {
    const ok = this.store.delete(id);
    return ok ? { success: true, data: null } : { success: false, data: null, message: "데이터를 찾지 못했습니다." };
  }
}

// 제네릭 사용: User 모델 저장/조회/출력
const userRepo: Repository<User> = new InMemoryRepository<User>();

// 샘플 데이터 생성
userRepo.create({ name: "홍길동", email: "user@example.com", role: "USER" });
userRepo.create({ name: "관리자", email: "admin@example.com", role: "ADMIN" });

// 동작 예시
const all1 = userRepo.findAll();
if (all1.success && all1.data.length > 0) {
  const firstId = all1.data[0].id;
  userRepo.update(firstId, { name: "김철수" });
}
const all2 = userRepo.findAll();
if (all2.success && all2.data.length > 1) {
  const secondId = all2.data[1].id;
  userRepo.delete(secondId);
}

// 출력 함수
function formatUsers(users: ReadonlyArray<User>): string {
  const lines = [
    "사용자 목록",
    ...users.map(u => `${u.name} / ${u.email} / ${u.role} / id=${u.id}`)
  ];
  return lines.join("\n");
}

// 콘솔 출력
const finalList = userRepo.findAll();
if (finalList.success) {
  const text = formatUsers(finalList.data);
  console.log(text);
}
