// NOTE: Please try to put the packets in the order according to their id. Thx!

import { Disconnect } from '@serenityjs/raknet-protocol';
import { Packet } from '../enums';
import { AddPlayer } from './AddPlayer';
import { BiomeDefinitionList } from './BiomeDefinitionList';
import { BlockPickRequest } from './BlockPickRequest';
import { CommandRequest } from './CommandRequest';
import { ContainerClose } from './ContainerClose';
import { ContainerOpen } from './ContainerOpen';
import { CreativeContent } from './CreativeContent';
import { Interact } from './Interact';
import { InventoryTransaction } from './InventoryTransaction';
import { LevelChunk } from './LevelChunk';
import { Login } from './Login';
import { MovePlayer } from './MovePlayer';
import { NetworkChunkPublisherUpdate } from './NetworkChunkPublisherUpdate';
import { NetworkSettings } from './NetworkSettings';
import { PacketViolationWarning } from './PacketViolationWarning';
import { PlayStatus } from './PlayStatus';
import { PlayerAction } from './PlayerAction';
import { PlayerList } from './PlayerList';
import { RemoveEntity } from './RemoveEntity';
import { RequestChunkRadius } from './RequestChunkRadius';
import { RequestNetworkSettings } from './RequestNetworkSettings';
import { ResourcePackClientResponse } from './ResourcePackClientResponse';
import { ResourcePackStack } from './ResourcePackStack';
import { ResourcePacksInfo } from './ResourcePacksInfo';
import { ScriptMessage } from './ScriptMessage';
// import { SelectedSlot } from './SelectedSlot';
import { SetEntityData } from './SetEntityData';
import { SetLocalPlayerAsInitialized } from './SetLocalPlayerAsInitialized';
import { SetTitle } from './SetTitle';
import { StartGame } from './StartGame';
import { Text } from './Text';
import { ToastRequest } from './ToastRequest';
import { UpdateAbilities } from './UpdateAbilities';
import { UpdateAttributes } from './UpdateAttributes';

const Packets = {
	[Packet.Login]: Login, // 1
	[Packet.PlayStatus]: PlayStatus, // 2
	[Packet.Disconnect]: Disconnect, // 5
	[Packet.ResourcePacksInfo]: ResourcePacksInfo, // 6
	[Packet.ResourcePackStack]: ResourcePackStack, // 7
	[Packet.ResourcePackClientResponse]: ResourcePackClientResponse, // 8
	[Packet.Text]: Text, // 9
	[Packet.StartGame]: StartGame, // 11
	[Packet.AddPlayer]: AddPlayer, // 12
	[Packet.RemoveEntity]: RemoveEntity, // 14
	[Packet.MovePlayer]: MovePlayer, // 19
	[Packet.UpdateAttributes]: UpdateAttributes, // 29
	[Packet.InventoryTransaction]: InventoryTransaction, // 30
	[Packet.Interact]: Interact, // 33
	[Packet.BlockPickRequest]: BlockPickRequest, // 34
	[Packet.PlayerAction]: PlayerAction, // 36
	[Packet.SetEntityData]: SetEntityData, // 39
	[Packet.ContainerOpen]: ContainerOpen, // 46
	[Packet.ContainerClose]: ContainerClose, // 47
	[Packet.LevelChunk]: LevelChunk, // 58
	[Packet.PlayerList]: PlayerList, // 63
	[Packet.RequestChunkRadius]: RequestChunkRadius, // 69
	[Packet.CommandRequest]: CommandRequest, // 77
	[Packet.SetTitle]: SetTitle, // 88
	[Packet.SetLocalPlayerAsInitialized]: SetLocalPlayerAsInitialized, // 113
	[Packet.NetworkChunkPublisherUpdate]: NetworkChunkPublisherUpdate, // 121
	[Packet.BiomeDefinitionList]: BiomeDefinitionList, // 122
	[Packet.NetworkSettings]: NetworkSettings, // 143
	[Packet.CreativeContent]: CreativeContent, // 145
	[Packet.PacketViolationWarning]: PacketViolationWarning, // 156
	[Packet.ScriptMessage]: ScriptMessage, // 177
	[Packet.ToastRequest]: ToastRequest, // 186
	[Packet.UpdateAbilities]: UpdateAbilities, // 187
	[Packet.RequestNetworkSettings]: RequestNetworkSettings, // 193
};

export { Packets };
