import { EasingType, system, world } from "@minecraft/server";
import { MessageFormData, ModalFormData, ActionFormData } from "@minecraft/server-ui";
import { Module } from "noxcrew.common.scripting/index.js";
/**
 * Manages the tutorial sequence.
 */
export class CameraCreator extends Module {
    constructor(container) {
        super(container);
    }
    setup() {
        // Make sure pathID is here
        CameraCreator.OBJ_CAMERA.addScore('pathID', 0);
        this.listenFor(world.afterEvents.itemUse, ({ itemStack, source }) => {
            if (itemStack.typeId == CameraCreator.item) {
                this.cameraState(source);
            }
        });
    }
    cameraState(player) {
        CameraCreator.OBJ_CAMERA.addScore(player, 0);
        const playerCamScore = CameraCreator.OBJ_CAMERA.getScore(player) ?? CameraCreator.OBJ_CAMERA.addScore(player, 0);
        const allObjectives = world.scoreboard.getObjectives();
        const cameraPaths = allObjectives.filter(camPaths => camPaths.id.indexOf('camera.path') !== -1);
        if (playerCamScore > 0) {
            if (playerCamScore < 5)
                this.createCameraPositions(player, playerCamScore);
            else {
                const playerEditScore = CameraCreator.OBJ_CAMERAEDITOR.getScore(player) ?? CameraCreator.OBJ_CAMERAEDITOR.addScore(player, 0);
                const currentPath = world.scoreboard.getObjective(`camera.path.${playerEditScore}`);
                this.showPathEditMenu(player, currentPath);
            }
        }
        else if (cameraPaths.length > 0) {
            this.showMainMenu(player);
        }
        else {
            this.showCameraCreator(player);
        }
    }
    /**
     * Show the Camera Creator main menu
     */
    async showMainMenu(player) {
        const menuForm = await new MessageFormData()
            .title(`${CameraCreator.TITLE_TEXT} - v${CameraCreator.VERSION}`)
            .body('Welcome to the §cCamera Creator§r!\nCamera Creator is a tool to allow you to create a 2 point camera path.\nPlease Select an Option!')
            .button1('Create Camera')
            .button2('View Camera Paths')
            .show(player);
        if (menuForm.canceled || menuForm.selection == null)
            return;
        if (menuForm.selection == 0)
            this.showCameraCreator(player);
        else
            this.showSelectPathMenu(player);
    }
    async showCameraCreator(player) {
        const creatorForm = await new MessageFormData()
            .title(`${CameraCreator.TITLE_TEXT}: Create Camera`)
            .body('Options:\n\n§cNew Camera Path§r: Create a brand new 2 point camera path for cutscenes!\n\n§cImport Camera Path§r: Import an existing camera path from your camera presets!')
            .button1('Import Camera Path')
            .button2('New Camera Path')
            .show(player);
        if (creatorForm.canceled || creatorForm.selection == null)
            return;
        if (creatorForm.selection == 0)
            this.importPath(player);
        else
            this.createCameraPath(player);
    }
    /**
     * Show the selected paths options
     */
    async showSelectPathMenu(player) {
        const allObjectives = world.scoreboard.getObjectives();
        const cameraPaths = allObjectives.filter(camPaths => camPaths.id.indexOf('camera.path') !== -1);
        const cameraPathsList = cameraPaths.map(n => n.displayName);
        const pathMenu = await new ModalFormData()
            .title(`${CameraCreator.TITLE_TEXT}: Select Path`)
            .dropdown('§cPick Path', cameraPathsList)
            .toggle('Hide Player?', false)
            .show(player);
        if (pathMenu.canceled || pathMenu.formValues == null)
            return;
        const selectedPath = cameraPaths[pathMenu.formValues[0]];
        const hidePlayer = pathMenu.formValues[1];
        this.showPathOptions(player, selectedPath, hidePlayer, '');
    }
    /**
     * Show the selected paths options
     */
    async showPathOptions(player, path, hide, error) {
        const pathSelectedForm = await new ActionFormData()
            .title(`${CameraCreator.TITLE_TEXT}: ${path.displayName} Options`)
            .body(`${error}What do you want to do?`)
            .button('Start Path')
            .button('Edit Path')
            .button('Export Path')
            .button('Delete Path')
            .show(player);
        if (pathSelectedForm.canceled || pathSelectedForm.selection == null)
            return;
        switch (pathSelectedForm.selection) {
            case 0:
                const selcEaseType = path.getScore('ease') ?? 0;
                const cameraEaseTime = path.getScore('time') ?? 0;
                this.playCameraPath(player, path, selcEaseType, cameraEaseTime, hide, false);
                break;
            case 1:
                const currentPathId = path.getScore('ID') ?? 0;
                CameraCreator.OBJ_CAMERAEDITOR.setScore(player, currentPathId);
                this.showPathEditMenu(player, path);
                break;
            case 2:
                this.exportPath(player, path);
                break;
            case 3:
                player.sendMessage(`[§cCC§r] §l§cREMOVED§r ${path.displayName}`);
                world.scoreboard.removeObjective(path);
                break;
        }
    }
    /**
     * Export the selected paths keyframes
     */
    async exportPath(player, path) {
        const exportPaths = this.resolveCoords(path);
        const startingKeyframe = `"pos_x": ${exportPaths.x1},"pos_y": ${exportPaths.y1},"pos_z": ${exportPaths.z1},"rot_x": ${exportPaths.rx1},"rot_y": ${exportPaths.ry1}`;
        const endingKeyframe = `"pos_x": ${exportPaths.x2},"pos_y": ${exportPaths.y2},"pos_z": ${exportPaths.z2},"rot_x": ${exportPaths.rx2},"rot_y": ${exportPaths.ry2}`;
        const form = await new ModalFormData()
            .title(`${CameraCreator.TITLE_TEXT}: Exported Values`)
            .textField('Starting Keyframe Export', '', startingKeyframe)
            .textField('Ending Keyframe Export', '', endingKeyframe)
            .show(player);
        if (form.canceled || form.formValues == null)
            return;
    }
    /**
     * Show the selected paths ease options
     */
    async showEaseOptions(player, path, saveMode) {
        const easings = Object.keys(EasingType);
        const form = new ModalFormData();
        form.title(`${CameraCreator.TITLE_TEXT}: Ease & Time`);
        form.dropdown('§cSelect Ease', easings);
        form.slider('Path Time', 1, 100, 1, 10);
        if (!saveMode)
            form.toggle('Hide Player?', false);
        const result = await form.show(player);
        if (result.canceled || result.formValues == null)
            return;
        const selcEaseType = result.formValues[0];
        const cameraEaseTime = result.formValues[1];
        const hidePlayer = result.formValues[2];
        if (saveMode) {
            path.setScore('ease', selcEaseType);
            path.setScore('time', cameraEaseTime);
        }
        else {
            this.playCameraPath(player, path, selcEaseType, cameraEaseTime, hidePlayer, true);
        }
    }
    /**
     * Plays the selected camera path
     */
    async playCameraPath(player, path, easeNum, easeTime, hide, testMode) {
        const cameraPaths = this.resolveCoords(path);
        const easings = Object.keys(EasingType);
        if (hide) {
            player.addEffect('invisibility', 20000000, { showParticles: false });
            player.runCommand('inputpermission set @s movement disabled');
        }
        player.camera.setCamera('minecraft:free', {
            location: { x: cameraPaths.x1, y: cameraPaths.y1, z: cameraPaths.z1 },
            rotation: { x: cameraPaths.rx1, y: cameraPaths.ry1 },
        });
        player.camera.setCamera('minecraft:free', {
            location: { x: cameraPaths.x2, y: cameraPaths.y2, z: cameraPaths.z2 },
            rotation: { x: cameraPaths.rx2, y: cameraPaths.ry2 },
            easeOptions: {
                easeTime: easeTime,
                easeType: easings[easeNum],
            },
        });
        system.runTimeout(() => {
            if (hide) {
                player.removeEffect('invisibility');
                player.runCommand('inputpermission set @s movement enabled');
            }
            if (testMode) {
                this.showPathEditMenu(player, path);
            }
            player.camera.clear();
        }, easeTime * 20 + 40);
    }
    /**
     * Opens the naming screen for a new path
     */
    async createCameraPath(player) {
        const camCreateForm = await new ModalFormData()
            .title(`${CameraCreator.TITLE_TEXT}: New Path`)
            .textField('Path Name', 'Type Here')
            .show(player);
        if (camCreateForm.canceled || camCreateForm.formValues == null)
            return;
        // Store Path Name
        const pathName = camCreateForm.formValues[0];
        // Increment the pathID
        let pathId = (CameraCreator.OBJ_CAMERA.getScore('pathID') ?? CameraCreator.OBJ_CAMERA.addScore('pathID', 0)) + 1;
        world.scoreboard.addObjective(`camera.path.${pathId}`, pathName);
        CameraCreator.OBJ_CAMERA.setScore('pathID', pathId);
        world.scoreboard.getObjective(`camera.path.${pathId}`)?.setScore('ID', pathId);
        // Update Player Score to keep track of Current State
        CameraCreator.OBJ_CAMERA.setScore(player, 1);
        CameraCreator.OBJ_CAMERAEDITOR.setScore(player, pathId);
        player.sendMessage('[§cCC§r] §l§aENTERED PATH EDITOR');
    }
    /**
     * Import the selected paths keyframes
     */
    async importPath(player) {
        const importCam = await new ModalFormData()
            .title(`${CameraCreator.TITLE_TEXT}: Import Camera`)
            .textField('Path Name', '')
            .textField('Starting Keyframe import', '')
            .textField('Ending Keyframe import', '')
            .show(player);
        if (importCam.canceled || importCam.formValues == null)
            return;
        const pathName = importCam.formValues[0];
        const startFrame = importCam.formValues[1];
        const endFrame = importCam.formValues[2];
        if (!startFrame || !endFrame)
            return;
        const pos1 = this.convertCameraToScores(startFrame);
        const pos2 = this.convertCameraToScores(endFrame);
        if (!pos1 || !pos2)
            return;
        const keyframe1 = pos1.map(Number);
        const keyframe2 = pos2.map(Number);
        // Increment the pathID
        let pathId = (CameraCreator.OBJ_CAMERA.getScore('pathID') ?? CameraCreator.OBJ_CAMERA.addScore('pathID', 0)) + 1;
        const currentPath = world.scoreboard.addObjective(`camera.path.${pathId}`, pathName);
        CameraCreator.OBJ_CAMERA.setScore('pathID', pathId);
        currentPath.setScore('ID', pathId);
        currentPath.setScore(`x1`, keyframe1[0] * 100);
        currentPath.setScore(`y1`, keyframe1[1] * 100);
        currentPath.setScore(`z1`, keyframe1[2] * 100);
        currentPath.setScore(`rx1`, keyframe1[3] * 10);
        currentPath.setScore(`ry1`, keyframe1[4] * 10);
        currentPath.setScore(`x2`, keyframe2[0] * 100);
        currentPath.setScore(`y2`, keyframe2[1] * 100);
        currentPath.setScore(`z2`, keyframe2[2] * 100);
        currentPath.setScore(`rx2`, keyframe2[3] * 10);
        currentPath.setScore(`ry2`, keyframe2[4] * 10);
        await this.showEaseOptions(player, currentPath, true);
        player.sendMessage('[§cCC§r] §l§aPath Imported');
    }
    convertCameraToScores(keyframe) {
        const regex = /-?\d+(\.\d+)?/g;
        const numbers = keyframe.match(regex);
        if (numbers == null)
            return;
        return numbers;
    }
    /**
     * Saves the keyframe for the camera positions
     */
    async createCameraPositions(player, playerState) {
        const keyframe = playerState > 2 ? playerState - 2 : playerState;
        const playerHeadLoc = player.getHeadLocation();
        const playerRot = player.getRotation();
        const playerHeadLocString = `${playerHeadLoc.x.toFixed(2)},${playerHeadLoc.y.toFixed(2)},${playerHeadLoc.z.toFixed(2)}`;
        const playerRotString = `${playerRot.x.toFixed(1)},${playerRot.y.toFixed(1)}`;
        const camPosForm = await new ModalFormData()
            .title(`${CameraCreator.TITLE_TEXT}: Keyframe ${keyframe}`)
            .textField('Position', '', playerHeadLocString)
            .textField('Rotation', '', playerRotString)
            .toggle('Save Path', false)
            .show(player);
        if (camPosForm.canceled || camPosForm.formValues == null)
            return;
        // Location Convert
        const location = camPosForm.formValues[0];
        const locValues = location.toString().split(',');
        const locNumbers = locValues.map(Number);
        // Rotation Convert
        const rotation = camPosForm.formValues[1];
        const rotValues = rotation.toString().split(',');
        const rotNumbers = rotValues.map(Number);
        // Check if the Position has 3 numbers
        for (let i = 0; i < locNumbers.length; i++) {
            if (isNaN(locNumbers[i]))
                return player.sendMessage('[§cCC§r] §l§6Location only accepts numbers!');
        }
        if (locNumbers.length != 3)
            return player.sendMessage('[§cCC§r] §l§6Location needs 3 numbers!');
        // Check if the Rotation has 3 numbers
        for (let i = 0; i < rotNumbers.length; i++) {
            if (isNaN(rotNumbers[i]))
                return player.sendMessage('[§cCC§r] §l§6Rotation only accepts numbers!');
        }
        if (rotNumbers.length != 2)
            return player.sendMessage('[§cCC§r] §l§6Rotation needs 2 numbers!');
        if (!camPosForm.formValues[2]) {
            player.teleport({ x: locNumbers[0], y: locNumbers[1] - 1.52, z: locNumbers[2] }, { rotation: { x: rotNumbers[0], y: rotNumbers[1] } });
        }
        else {
            // Store the Values
            const playerEditScore = CameraCreator.OBJ_CAMERAEDITOR.getScore(player) ?? 0;
            const currentPath = world.scoreboard.getObjective(`camera.path.${playerEditScore}`);
            if (!currentPath)
                return;
            currentPath.setScore(`x${keyframe}`, locNumbers[0] * 100);
            currentPath.setScore(`y${keyframe}`, locNumbers[1] * 100);
            currentPath.setScore(`z${keyframe}`, locNumbers[2] * 100);
            currentPath.setScore(`rx${keyframe}`, rotNumbers[0] * 10);
            currentPath.setScore(`ry${keyframe}`, rotNumbers[1] * 10);
            // Update Player State
            player.sendMessage(`[§cCC§r] §l§aStored Camera Keyframe ${keyframe}!`);
            switch (playerState) {
                case 1:
                    CameraCreator.OBJ_CAMERA.setScore(player, playerState + 1);
                    break;
                case 2:
                    this.showPathEditMenu(player, currentPath);
                    break;
                case 3:
                    this.showPathEditMenu(player, currentPath);
                    CameraCreator.OBJ_CAMERA.setScore(player, 5);
                    break;
                case 4:
                    this.showPathEditMenu(player, currentPath);
                    CameraCreator.OBJ_CAMERA.setScore(player, 5);
                    break;
            }
        }
    }
    /**
     * Opens the editing menu for the selected paths
     */
    async showPathEditMenu(player, path) {
        const keyframe = this.resolveCoords(path);
        const form = await new ActionFormData()
            .title(`${CameraCreator.TITLE_TEXT}: Edit ${path.displayName}`)
            .button('Test Path')
            .button('Edit Keyframe 1')
            .button('Edit Keyframe 2')
            .button('Save Path')
            .show(player);
        if (form.canceled || form.selection == null)
            return;
        switch (form.selection) {
            case 0:
                this.showEaseOptions(player, path, false);
                break;
            case 1:
                CameraCreator.OBJ_CAMERA.setScore(player, 3);
                player.teleport({ x: keyframe.x1, y: keyframe.y1 - 1.52, z: keyframe.z1 }, { rotation: { x: keyframe.rx1, y: keyframe.ry1 } });
                break;
            case 2:
                CameraCreator.OBJ_CAMERA.setScore(player, 4);
                player.teleport({ x: keyframe.x2, y: keyframe.y2 - 1.52, z: keyframe.z2 }, { rotation: { x: keyframe.rx2, y: keyframe.ry2 } });
                break;
            case 3:
                this.showEaseOptions(player, path, true);
                CameraCreator.OBJ_CAMERA.setScore(player, 0);
                CameraCreator.OBJ_CAMERAEDITOR.setScore(player, -1);
                break;
        }
    }
    /**
     * Resolves the Coordinates for the selected paths
     */
    resolveCoords(path) {
        const pathCoords = {
            x1: path.getScore('x1') / 100,
            y1: path.getScore('y1') / 100,
            z1: path.getScore('z1') / 100,
            x2: path.getScore('x2') / 100,
            y2: path.getScore('y2') / 100,
            z2: path.getScore('z2') / 100,
            rx1: path.getScore('rx1') / 10,
            ry1: path.getScore('ry1') / 10,
            rx2: path.getScore('rx2') / 10,
            ry2: path.getScore('ry2') / 10,
        };
        return pathCoords;
    }
}
CameraCreator.VERSION = '0.2.0';
CameraCreator.TITLE_TEXT = '§cCamera Creator§r';
CameraCreator.OBJ_CAMERA = world.scoreboard.getObjective('noxcrew.camera') ?? world.scoreboard.addObjective('noxcrew.camera', 'Camera Creator');
CameraCreator.OBJ_CAMERAEDITOR = world.scoreboard.getObjective('noxcrew.camera.editing') ??
    world.scoreboard.addObjective('noxcrew.camera.editing', 'Camera Editing');
CameraCreator.item = 'noxcrew.common.devtools:camera_creator';
//# sourceMappingURL=main.js.map