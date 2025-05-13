/**
 * Hàm tiện ích để cập nhật URL params
 * @param {URLSearchParams} currentParams - URLSearchParams hiện tại
 * @param {Object} updates - Object chứa các cặp key-value cần cập nhật
 * @param {Array} removes - Array chứa các key cần xóa
 * @returns {URLSearchParams} - URLSearchParams mới sau khi cập nhật
 */
export function updateURLParams(currentParams, updates = {}, removes = []) {
  const newParams = new URLSearchParams(currentParams.toString());

  // Thêm hoặc cập nhật các params
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      newParams.set(key, value);
    }
  });

  // Xóa các params không cần thiết
  removes.forEach(key => {
    newParams.delete(key);
  });

  return newParams;
}