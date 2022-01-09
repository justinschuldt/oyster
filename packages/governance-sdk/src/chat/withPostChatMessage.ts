import { Account, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_CHAT_SCHEMA } from './serialisation';
import { serialize } from 'borsh';
import { PostChatMessageArgs } from './instructions';
import { GOVERNANCE_CHAT_PROGRAM_ID, ChatMessageBody } from './accounts';
import { SYSTEM_PROGRAM_ID } from '../tools/sdk/runtime';

export async function withPostChatMessage(
  instructions: TransactionInstruction[],
  signers: Account[],
  governanceProgramId: PublicKey,
  governance: PublicKey,
  proposal: PublicKey,
  tokenOwnerRecord: PublicKey,
  governanceAuthority: PublicKey,
  payer: PublicKey,
  replyTo: PublicKey | undefined,
  body: ChatMessageBody,
) {
  const args = new PostChatMessageArgs({
    body,
  });

  const data = Buffer.from(serialize(GOVERNANCE_CHAT_SCHEMA, args));

  const chatMessage = new Account();
  signers.push(chatMessage);

  let keys = [
    {
      pubkey: governanceProgramId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: governance,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: proposal,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: tokenOwnerRecord,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: governanceAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: chatMessage.publicKey,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: payer,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: SYSTEM_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (replyTo) {
    keys.push({
      pubkey: replyTo,
      isWritable: false,
      isSigner: false,
    });
  }

  instructions.push(
    new TransactionInstruction({
      keys,
      programId: GOVERNANCE_CHAT_PROGRAM_ID,
      data,
    }),
  );
}
