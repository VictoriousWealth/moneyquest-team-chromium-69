export const useAchievements = () => {
  const checkAndAwardAchievements = async (_args?: any) => ({ awarded: [] as string[] });
  return { checkAndAwardAchievements };
};
