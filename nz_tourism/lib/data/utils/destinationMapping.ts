export const destinationGuidMap: {[key: string]: string} = {
    'queenstown': 'f8a7b3c1-d2e4-4f5a-9b8c-7d6e5f4a3b2c',
    'auckland': 'a1b2c3d4-e5f6-4a5b-8c9d-7e6f5a4b3c2',
    'rotorua': 'b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6',
    'milford-sound': 'c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7',
    'hobbiton': 'd4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8'
  };
  
  // 反向映射：从GUID到字符串ID
  export const guidToStringMap: {[key: string]: string} = Object.fromEntries(
    Object.entries(destinationGuidMap).map(([key, value]) => [value, key])
  );
  
  /**
   * 将字符串ID转换为GUID（用于API调用）
   * @param destinationId 字符串ID（如 'queenstown'）或已经是GUID
   * @returns GUID格式的ID
   */
  export function mapToGuid(destinationId: string): string {
    // 如果已经是GUID格式，直接返回
    if (isGuid(destinationId)) {
      return destinationId;
    }
    
    // 如果是字符串ID，转换为GUID
    const guid = destinationGuidMap[destinationId];
    if (guid) {
      console.log(`目的地ID映射: "${destinationId}" -> "${guid}"`);
      return guid;
    }
    
    // 如果找不到映射，返回原ID（可能是新的目的地）
    console.warn(`未找到目的地ID映射: ${destinationId}`);
    return destinationId;
  }
  
  /**
   * 将GUID转换为字符串ID（用于路由显示）
   * @param guid GUID格式的ID
   * @returns 字符串ID或原GUID
   */
  export function mapToString(guid: string): string {
    const stringId = guidToStringMap[guid];
    if (stringId) {
      return stringId;
    }
    return guid; // 如果找不到映射，返回原GUID
  }
  
  /**
   * 检查是否为GUID格式
   * @param id 要检查的ID
   * @returns 是否为GUID格式
   */
  export function isGuid(id: string): boolean {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return guidRegex.test(id);
  }
  
  /**
   * 获取用于显示的目的地ID（优先使用字符串ID）
   * @param id 目的地ID
   * @returns 用于显示的ID
   */
  export function getDisplayId(id: string): string {
    return isGuid(id) ? mapToString(id) : id;
  }
  
  /**
   * 获取用于API调用的目的地ID（优先使用GUID）
   * @param id 目的地ID
   * @returns 用于API调用的GUID
   */
  export function getApiId(id: string): string {
    return mapToGuid(id);
  }