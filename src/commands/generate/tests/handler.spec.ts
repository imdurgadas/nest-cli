import * as sinon from 'sinon';
import { GenerateHandler } from '../handler';
import { GenerateArguments } from '../command';
import { TemplateId } from '../template.replacer';
import { Asset, AssetGenerator } from '../asset.generator';
import { AssetEmitter } from '../asset.emitter';
import { LoggerService } from '../../../logger/logger.service';

describe('GenerateHandler', () => {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  const assets: Asset[] = [
    {
      path: 'name.type.ts',
      template: {
        id: TemplateId.MAIN,
        content: 'content'
      }
    },
    {
      path: 'name.type.spec.ts',
      template: {
        id: TemplateId.SPEC,
        content: 'content'
      }
    }
  ];

  let generateStub: sinon.SinonStub;
  let emitStub: sinon.SinonStub;
  beforeEach(() => {
    generateStub = sandbox.stub(AssetGenerator.prototype, 'generate').callsFake(() => Promise.resolve(assets));
    emitStub = sandbox.stub(AssetEmitter.prototype, 'emit').callsFake(() => Promise.resolve());
    LoggerService.setLogger({
      debug: () => {},
      error: () => {},
      info: () => {},
      log: () => {},
      warn: () => {}
    });
  });

  let handler: GenerateHandler;
  beforeEach(() => handler = new GenerateHandler());
  describe('#handle()', () => {
    const args: GenerateArguments = {
      type: 'type',
      name: 'name'
    };
    it('should generate assets according to input args', async () => {
      await handler.handle(args);
      sinon.assert.calledWith(generateStub, args.type, args.name);
    });
    it('should emit generated assets', async () => {
      await handler.handle(args);
      sinon.assert.calledWith(emitStub, 'name', assets);
    });
  });
});
