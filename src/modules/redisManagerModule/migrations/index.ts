export default [
  // {
  //   id: '1708847997216',
  //   action: 'WIPE',
  //   db: 'active_staking',
  //   pattern: 'ranked_list_by_rewards:*'
  // },
  // {
  //   id: '1711311248592',
  //   action: 'WIPE',
  //   db: 'active_staking',
  //   pattern: 'post_ids_ranked_list:*'
  // },
  // {
  //   id: '1711311248692',
  //   action: 'WIPE',
  //   db: 'active_staking',
  //   pattern: 'post_creation_data_cache'
  // },
  {
    id: '1712159057166',
    action: 'BGREWRITEAOF'
  }
];
