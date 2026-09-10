const versaoController = require('../../../api/controllers/versao');
const { version: versaoPackage } = require('../../../package.json');

describe('Versao Controller', () => {
  // Mock para simular o objeto req e res
  const req = {};
  const res = {
    send: jest.fn(),
  };

  const versaoApiOriginal = process.env.VERSAO_API;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (versaoApiOriginal === undefined) {
      delete process.env.VERSAO_API;
    } else {
      process.env.VERSAO_API = versaoApiOriginal;
    }
  });

  test('get deve retornar a versão do package.json quando VERSAO_API não está definido', () => {
    // Simula o cenário onde VERSAO_API não está definido
    delete process.env.VERSAO_API;

    // Chama a função retornada pelo controller para obter o objeto controller
    const { get } = versaoController();
    // Chama o método get do objeto controller
    get(req, res);

    expect(res.send).toHaveBeenCalledWith(`Bia ${versaoPackage}`);
  });

  test('get não deve conter versão hardcoded no fallback', () => {
    // Garante que o fallback acompanha o package.json, e não um literal fixo
    delete process.env.VERSAO_API;

    const { get } = versaoController();
    get(req, res);

    expect(versaoPackage).toBeTruthy();
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining(versaoPackage));
  });

  test('get deve retornar a string de resposta correta quando VERSAO_API está definido', () => {
    // Simula o cenário onde VERSAO_API está definido
    process.env.VERSAO_API = '1.0.0';

    // Chama a função retornada pelo controller para obter o objeto controller
    const { get } = versaoController();
    // Chama o método get do objeto controller
    get(req, res);

    expect(res.send).toHaveBeenCalledWith('Bia 1.0.0');
  });
});
