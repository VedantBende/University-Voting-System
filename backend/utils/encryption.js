import crypto from 'crypto';

export const encryptVoterId = (userId, electionId) => {
  const secret = process.env.VOTE_ENCRYPTION_SECRET || 'default_secret_key';
  return crypto
    .createHash('sha256')
    .update(`${userId}-${electionId}-${secret}`)
    .digest('hex');
};

export const generateVoteHash = (electionId, candidateId, timestamp) => {
  return crypto
    .createHash('sha256')
    .update(`${electionId}-${candidateId}-${timestamp}`)
    .digest('hex');
};

export default { encryptVoterId, generateVoteHash };
