from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.omex_meta.data_model import OmexMetadataInputFormat, OmexMetadataSchema
from biosimulators_utils.sedml.data_model import ModelLanguage, Symbol
from biosimulators_utils.sedml.io import SedmlSimulationReader
from openapi_core.contrib.requests import RequestsOpenAPIRequestFactory
from openapi_core.validation.response.validators import ResponseValidator
from openapi_core.validation.response.datatypes import OpenAPIResponse
from openapi_core.validation.request.validators import RequestValidator
from openapi_core.validation.request.datatypes import (
    OpenAPIRequest,
    RequestParameters,
)
from openapi_core import create_spec
from openapi_spec_validator import validate_spec as validate_api_spec
from openapi_spec_validator.readers import read_from_filename as read_api_spec_from_filename
from src import app
from src.exceptions import BadRequestException
from src.handlers.combine.get_metadata_for_combine_archive import _convert_rdf_node_to_json
from unittest import mock
from werkzeug.datastructures import MultiDict
import imghdr
import importlib.util
import io
import json
import os
import requests.exceptions
import shutil
import src.utils
import tempfile
import unittest
import urllib.parse
import yaml


class HandlersTestCase(unittest.TestCase):
    API_SPECS_FILENAME = os.path.join(os.path.dirname(__file__),
                                      '..', 'src', 'spec', 'spec.yml')
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), 'fixtures')
    TEST_CASE = 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations'

    def setUp(self):
        self.temp_dirname = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dirname)

    # @classmethod
    # def setUpClass(cls):
    #     with open(cls.API_SPECS_FILENAME, 'rb') as specs_file:
    #         cls.api_specs_dict = yaml.load(specs_file, Loader=yaml.Loader)
    #     api_specs = create_spec(cls.api_specs_dict)
    #     cls.request_validator = RequestValidator(api_specs)
    #     cls.response_validator = ResponseValidator(api_specs)

    def test_is_api_spec_valid(self):
        spec_dict, spec_url = read_api_spec_from_filename(self.API_SPECS_FILENAME)
        validate_api_spec(spec_dict)

    def test_get_manifest_for_combine_archive_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        data = MultiDict([
            ('url', archive_url),
        ])
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        endpoint = '/combine/manifest'
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        manifest = response.json

        expected_manifest = {
            '_type': 'CombineArchiveManifest',
            'contents': [
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/sbml',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': './Caravagna2010.xml',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'Caravagna2010.xml',
                        },
                    },
                    'master': False
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/sed-ml',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': './BIOMD0000000912_sim.sedml',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'BIOMD0000000912_sim.sedml',
                        },
                    },
                    'master': True
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/omex',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': '.',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': '.',
                        },
                    },
                    'master': False
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/omex-metadata',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': 'metadata.rdf',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'metadata.rdf',
                        },
                    },
                    'master': False
                }
            ]
        }
        self.assertEqual(manifest, expected_manifest, manifest)

        # validate request and response
        if hasattr(self, "request_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/manifest',
                method='post',
                body={
                    'url': archive_url,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )
            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_manifest),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_manifest_for_combine_archive_file(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
        ])
        endpoint = '/combine/manifest'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        manifest = response.json

        expected_manifest = {
            '_type': 'CombineArchiveManifest',
            'contents': [
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/sbml',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': './Caravagna2010.xml',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'Caravagna2010.xml',
                        },
                    },
                    'master': False
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/sed-ml',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': './BIOMD0000000912_sim.sedml',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'BIOMD0000000912_sim.sedml',
                        },
                    },
                    'master': True
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/omex',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': '.',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': '.',
                        },
                    },
                    'master': False
                },
                {
                    '_type': 'CombineArchiveManifestContent',
                    'format': 'http://identifiers.org/combine.specifications/omex-metadata',
                    'location': {
                        '_type': 'CombineArchiveManifestLocation',
                        'path': 'metadata.rdf',
                        'value': {
                            '_type': 'CombineArchiveContentFile',
                            'filename': 'metadata.rdf',
                        },
                    },
                    'master': False
                }
            ]
        }
        self.assertEqual(manifest, expected_manifest)

        fid.close()

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/manifest',
                method='post',
                body={
                    'file': file_content,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_manifest),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_manifest_for_combine_archive_error_handling(self):
        endpoint = '/combine/manifest'
        data = MultiDict([
            ('url', 'x'),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertTrue(response.json['title'].startswith(
            'COMBINE/OMEX archive could not be loaded'))

        if hasattr(self, "response_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/manifest',
                method='post',
                body={
                    'url': 'x',
                },
                mimetype=None,
                parameters=RequestParameters(),
            )
            response = OpenAPIResponse(
                data=json.dumps(response.json),
                status_code=400,
                mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

        response = mock.Mock(
            raise_for_status=lambda: None,
            content=b'.',
        )
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('not a valid zip archive', response.json['title'])

        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'no-manifest.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('does not contain a manifest', response.json['title'])

        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'bad-manifest.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('does not contain a valid manifest', response.json['title'])

    def test_get_parameters_variables_for_simulation_from_file(self):
        endpoint = '/sed-ml/get-parameters-variables-for-simulation'

        model_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'Chaouiya-BMC-Syst-Biol-2013-EGF-TNFa-signaling.xml'))
        model_fid = open(model_filename, 'rb')

        data = MultiDict([
            ('modelLanguage', 'urn:sedml:language:sbml'),
            ('modelingFramework', 'SBO_0000547'),
            ('simulationType', 'SedUniformTimeCourseSimulation'),
            ('simulationAlgorithm', 'KISAO_0000450'),
            ('modelFile', model_fid),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        model_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        sed_doc = response.json
        vars = [data_gen['variables'][0] for data_gen in sed_doc['dataGenerators']]

        self.assertEqual(vars[0]['id'], 'time')
        self.assertEqual(vars[0]['name'], 'Time')
        self.assertEqual(vars[0]['symbol'], Symbol.time)
        self.assertNotIn('target', vars[0])

        self.assertEqual(vars[-1]['id'], 'level_species_nik')
        self.assertEqual(vars[-1]['name'], 'Level of species "nik"')
        self.assertNotIn('symbol', vars[-1])

        vars[-1]['target']['namespaces'].sort(key=lambda ns: ns['prefix'])
        self.assertEqual(
            vars[-1]['target'],
            {
                "_type": "SedTarget",
                "value": "/sbml:sbml/sbml:model/qual:listOfQualitativeSpecies/qual:qualitativeSpecies[@qual:id='nik']",
                "namespaces": [
                    {"_type": "Namespace", "prefix": "qual", "uri": "http://www.sbml.org/sbml/level3/version1/qual/version1"},
                    {"_type": "Namespace", "prefix": "sbml", "uri": "http://www.sbml.org/sbml/level3/version1/core"},
                ]
            },
        )

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(model_filename, 'rb') as file:
                model_content = file.read()
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/' + endpoint,
                method='post',
                body={
                    'modelLanguage': 'urn:sedml:language:sbml',
                    'modelingFramework': 'SBO_0000547',
                    'simulationType': 'SedUniformTimeCourseSimulation',
                    'simulationAlgorithm': 'KISAO_0000029',
                    'modelFile': model_content,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(sed_doc),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_parameters_variables_for_simulation_from_url(self):
        endpoint = '/sed-ml/get-parameters-variables-for-simulation'

        model_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'Chaouiya-BMC-Syst-Biol-2013-EGF-TNFa-signaling.xml'))
        model_fid = open(model_filename, 'rb')

        model_url = 'http://models.org/Chaouiya-BMC-Syst-Biol-2013-EGF-TNFa-signaling.xml'

        data = MultiDict([
            ('modelLanguage', 'urn:sedml:language:sbml'),
            ('modelingFramework', 'SBO_0000547'),
            ('simulationType', 'SedUniformTimeCourseSimulation'),
            ('simulationAlgorithm', 'KISAO_0000450'),
            ('modelUrl', model_url),
        ])
        with app.app.app.test_client() as client:
            def requests_get(url):
                assert url == model_url
                return mock.Mock(raise_for_status=lambda: None, content=model_fid.read())

            with mock.patch('requests.get', side_effect=requests_get):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        model_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        sed_doc = response.json
        vars = [data_gen['variables'][0] for data_gen in sed_doc['dataGenerators']]

        self.assertEqual(vars[0]['id'], 'time')
        self.assertEqual(vars[0]['name'], 'Time')
        self.assertEqual(vars[0]['symbol'], Symbol.time)
        self.assertNotIn('target', vars[0])

        self.assertEqual(vars[-1]['id'], 'level_species_nik')
        self.assertEqual(vars[-1]['name'], 'Level of species "nik"')
        self.assertNotIn('symbol', vars[-1])

        vars[-1]['target']['namespaces'].sort(key=lambda ns: ns['prefix'])
        self.assertEqual(
            vars[-1]['target'],
            {
                "_type": "SedTarget",
                "value": "/sbml:sbml/sbml:model/qual:listOfQualitativeSpecies/qual:qualitativeSpecies[@qual:id='nik']",
                "namespaces": [
                    {"_type": "Namespace", "prefix": "qual", "uri": "http://www.sbml.org/sbml/level3/version1/qual/version1"},
                    {"_type": "Namespace", "prefix": "sbml", "uri": "http://www.sbml.org/sbml/level3/version1/core"},
                ]
            },
        )

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(model_filename, 'rb') as file:
                model_content = file.read()
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/' + endpoint,
                method='post',
                body={
                    'modelLanguage': 'urn:sedml:language:sbml',
                    'modelingFramework': 'SBO_0000547',
                    'simulationType': 'SedUniformTimeCourseSimulation',
                    'simulationAlgorithm': 'KISAO_0000029',
                    'modelFile': model_content,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(sed_doc),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_parameters_variables_for_simulation_with_plot(self):
        endpoint = '/sed-ml/get-parameters-variables-for-simulation'

        model_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'wilson-cowan.ode'))
        model_fid = open(model_filename, 'rb')

        model_url = 'http://models.org/wilson-cowan.ode'

        data = MultiDict([
            ('modelLanguage', 'urn:sedml:language:xpp'),
            ('modelingFramework', 'SBO_0000293'),
            ('simulationType', 'SedUniformTimeCourseSimulation'),
            ('simulationAlgorithm', 'KISAO_0000019'),
            ('modelUrl', model_url),
        ])
        with app.app.app.test_client() as client:
            def requests_get(url):
                assert url == model_url
                return mock.Mock(raise_for_status=lambda: None, content=model_fid.read())

            with mock.patch('requests.get', side_effect=requests_get):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        model_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        sed_doc = response.json
        vars = [data_gen['variables'][0] for data_gen in sed_doc['dataGenerators']]

        self.assertEqual(vars[0]['id'], 'time')
        self.assertEqual(vars[0]['name'], 'Time')
        self.assertEqual(vars[0]['symbol'], Symbol.time)
        self.assertNotIn('target', vars[0])

        self.assertEqual(vars[-1]['id'], 'dynamics_V')
        self.assertEqual(vars[-1]['name'], 'Dynamics of "V"')
        self.assertNotIn('symbol', vars[-1])

        self.assertEqual(
            vars[-1]['target'],
            {
                "_type": "SedTarget",
                "value": "V",
            },
        )

        data_gen_u = next(data_gen for data_gen in sed_doc['dataGenerators'] if data_gen['id'] == 'data_generator_dynamics_U')
        data_gen_v = next(data_gen for data_gen in sed_doc['dataGenerators'] if data_gen['id'] == 'data_generator_dynamics_V')
        self.assertEqual(data_gen_u, {
            "_type": "SedDataGenerator",
            "id": "data_generator_dynamics_U",
            "name": 'Dynamics of "U"',
            "parameters": [],
            "variables": [{
                "_type": "SedVariable",
                "id": "dynamics_U",
                "name": 'Dynamics of "U"',
                "target": {
                    "_type": "SedTarget",
                    "value": "U",
                },
                "task": "task",
            }],
            "math": "dynamics_U",            
        })
        self.assertEqual(data_gen_v, {
            "_type": "SedDataGenerator",
            "id": "data_generator_dynamics_V",
            "name": 'Dynamics of "V"',
            "parameters": [],
            "variables": [{
                "_type": "SedVariable",
                "id": "dynamics_V",
                "name": 'Dynamics of "V"',
                "target": {
                    "_type": "SedTarget",
                    "value": "V",
                },
                "task": "task",
            }],
            "math": "dynamics_V",
        })

        plot = sed_doc['outputs'][-1]

        self.assertEqual(
            plot,
            {
                "_type": "SedPlot2D",
                "id": "plot",
                "name": None,
                "curves": [
                    {
                        "_type": "SedCurve",
                        "id": "curve_1",
                        "name": "V vs U",
                        "xDataGenerator": "data_generator_dynamics_U",
                        "yDataGenerator": "data_generator_dynamics_V",
                        'xScale': 'linear',
                        'yScale': 'linear',
                    }
                ]
            },
        )

    def test_create_combine_archive_with_uploaded_model_file(self):
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def save_file_to_s3_bucket(filename, public=True, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.utils.save_file_to_s3_bucket', side_effect=save_file_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, archive_filename)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 3)

        for content, expected_content in zip(archive.contents, archive_specs['contents']):
            self.assertEqual(content.location, expected_content['location']['path'])
            self.assertEqual(content.format, expected_content['format'])
            self.assertEqual(content.master, expected_content['master'])

        with self.assertRaisesRegex(ValueError, 'Missing a required XML attribute'):
            sed_doc = SedmlSimulationReader().run(os.path.join(contents_dirname, archive_specs['contents'][2]['location']['path']),
                                                  validate_models_with_languages=True)
        sed_doc = SedmlSimulationReader().run(os.path.join(contents_dirname, archive_specs['contents'][2]['location']['path']),
                                              validate_models_with_languages=False)
        sed_doc_specs = archive_specs['contents'][2]['location']['value']
        self.assertEqual(sed_doc.level, sed_doc_specs['level'])
        self.assertEqual(sed_doc.version, sed_doc_specs['version'])

        self.assertEqual(sed_doc.tasks[0].model, sed_doc.models[0])
        self.assertEqual(len(sed_doc.models[0].changes), 2)
        self.assertEqual(sed_doc.models[0].changes[0].target,
                         "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='k1']/@value")
        self.assertEqual(sed_doc.models[0].changes[0].new_value, '1.2')
        self.assertEqual(sed_doc.models[0].changes[0].target_namespaces, {
            None: 'http://sed-ml.org/sed-ml/level1/version3',
            'sbml': 'http://www.sbml.org/sbml/level3/version1/core',
            'qual': 'http://www.sbml.org/sbml/level3/version1/qual/version1',
        })

        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].kisao_id, 'KISAO_0000488')
        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].new_value, '10')
        self.assertEqual(sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target,
                         "/sbml:sbml/sbml:model/qual:listOfQualitativeSpecies/qual:qualitativeSpecies[@qual:id='x']")
        self.assertEqual(
            sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target_namespaces,
            {
                None: 'http://sed-ml.org/sed-ml/level1/version3',
                "sbml": "http://www.sbml.org/sbml/level3/version1/core",
                "qual": "http://www.sbml.org/sbml/level3/version1/qual/version1"
            },
        )

    def test_create_combine_archive_with_uploaded_model_file_and_download(self):
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
            ('download', True),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.content_type, 'application/zip')
        downloaded_archive_filename = os.path.join(self.temp_dirname, 'archive-downloaded.omex')
        with open(downloaded_archive_filename, 'wb') as file:
            file.write(response.data)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(downloaded_archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 3)

    def test_create_combine_archive_with_model_at_url(self):
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        file_0_url = 'https://models.org/model.xml'
        file_1_url = 'https://models.org/file.txt'
        archive_specs['contents'][0]['location']['value'].pop('filename')
        archive_specs['contents'][1]['location']['value'].pop('filename')
        archive_specs['contents'][0]['location']['value']['_type'] = 'CombineArchiveContentUrl'
        archive_specs['contents'][1]['location']['value']['_type'] = 'CombineArchiveContentUrl'
        archive_specs['contents'][0]['location']['value']['url'] = file_0_url
        archive_specs['contents'][1]['location']['value']['url'] = file_1_url

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def save_file_to_s3_bucket(filename, public=True, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.utils.save_file_to_s3_bucket', side_effect=save_file_to_s3_bucket):
                def requests_get(url):
                    assert url in [file_0_url, file_1_url]
                    if url == file_0_url:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_0.read())
                    else:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_1.read())
                with mock.patch('requests.get', side_effect=requests_get):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, archive_filename)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 3)

        for content, expected_content in zip(archive.contents, archive_specs['contents']):
            self.assertEqual(content.location, expected_content['location']['path'])
            self.assertEqual(content.format, expected_content['format'])
            self.assertEqual(content.master, expected_content['master'])

        sed_doc = SedmlSimulationReader().run(os.path.join(contents_dirname, archive_specs['contents'][2]['location']['path']),
                                              validate_models_with_languages=False)
        sed_doc_specs = archive_specs['contents'][2]['location']['value']
        self.assertEqual(sed_doc.level, sed_doc_specs['level'])
        self.assertEqual(sed_doc.version, sed_doc_specs['version'])

        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].kisao_id, 'KISAO_0000488')
        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].new_value, '10')
        self.assertEqual(sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target,
                         "/sbml:sbml/sbml:model/qual:listOfQualitativeSpecies/qual:qualitativeSpecies[@qual:id='x']")
        self.assertEqual(
            sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target_namespaces,
            {
                None: 'http://sed-ml.org/sed-ml/level1/version3',
                "sbml": "http://www.sbml.org/sbml/level3/version1/core",
                "qual": "http://www.sbml.org/sbml/level3/version1/qual/version1"
            },
        )

    def test_add_file_to_combine_archive(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            def save_file_to_s3_bucket(filename, public=True, archive_filename=modified_archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.utils.save_file_to_s3_bucket', side_effect=save_file_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, modified_archive_filename)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                             'NewLocation.txt',
                         ]))

        content = next(content for content in archive.contents if content.location == 'NewLocation.txt')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        self.assertTrue(os.path.isfile(os.path.join(modified_archive_dirname, 'NewLocation.txt')))

    def test_add_file_to_combine_archive_upload_archive_by_url(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"url": 'htts://web.com/archive.omex'})),
            ('newContent', json.dumps(new_content)),
            ('files', new_content_fid),
        ])

        with open(archive_filename, 'rb') as file:
            get_response = mock.Mock(
                raise_for_status=lambda: None,
                content=file.read(),
            )

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            def save_file_to_s3_bucket(filename, public=True, archive_filename=modified_archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.utils.save_file_to_s3_bucket', side_effect=save_file_to_s3_bucket):
                with mock.patch('requests.get', return_value=get_response):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")

        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, modified_archive_filename)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                             'NewLocation.txt',
                         ]))

        content = next(content for content in archive.contents if content.location == 'NewLocation.txt')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        self.assertTrue(os.path.isfile(os.path.join(modified_archive_dirname, 'NewLocation.txt')))

    def test_add_file_to_combine_archive_at_existing_location(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': 'Caravagna2010.xml',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
            ('overwriteLocations', False),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            def save_file_to_s3_bucket(filename, public=True, archive_filename=modified_archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.utils.save_file_to_s3_bucket', side_effect=save_file_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, modified_archive_filename)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                             'Caravagna2010_1.xml',
                         ]))

        content = next(content for content in archive.contents if content.location == 'Caravagna2010_1.xml')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        self.assertTrue(os.path.isfile(os.path.join(modified_archive_dirname, 'Caravagna2010_1.xml')))

    def test_add_file_to_combine_archive_at_existing_location_overwrite(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': 'Caravagna2010.xml',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
            ('overwriteLocations', True),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            def save_file_to_s3_bucket(filename, public=True, archive_filename=modified_archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('src.utils.save_file_to_s3_bucket', side_effect=save_file_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, modified_archive_filename)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                         ]))

        content = next(content for content in archive.contents
                       if os.path.relpath(content.location, '.') == 'Caravagna2010.xml')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        with open(os.path.join(modified_archive_dirname, 'Caravagna2010.xml'), 'r') as file:
            self.assertEqual(file.read(), 'A text file\n')

    def test_add_file_to_combine_archive_download(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
            ('download', True),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.content_type, 'application/zip')
        modified_archive_filename = os.path.join(self.temp_dirname, 'archive-downloaded.omex')
        with open(modified_archive_filename, 'wb') as file:
            file.write(response.data)

        modified_archive_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(modified_archive_filename, modified_archive_dirname)

        self.assertEqual(set(os.path.relpath(content.location, '.') for content in archive.contents),
                         set([
                             'BIOMD0000000912_sim.sedml',
                             'Caravagna2010.xml',
                             'metadata.rdf',
                             'NewLocation.txt',
                         ]))

        content = next(content for content in archive.contents if content.location == 'NewLocation.txt')
        self.assertEqual(content.format, 'http://purl.org/NET/mediatypes/text/plain')
        self.assertEqual(content.master, False)
        self.assertTrue(os.path.isfile(os.path.join(modified_archive_dirname, 'NewLocation.txt')))

    def test_add_file_to_combine_archive_error_handling_missing_archive(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', new_content_fid),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        new_content_fid.close()

        self.assertEqual(response.status_code, 400, response.json)

    def test_add_file_to_combine_archive_error_handling_missing_file(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()

        self.assertEqual(response.status_code, 400, response.json)

    def test_add_file_to_combine_archive_error_handling_bad_archive(self):
        endpoint = '/combine/file'

        archive_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        archive_fid = open(archive_filename, 'rb')
        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"filename": archive_filename})),
            ('newContent', json.dumps(new_content)),
            ('files', archive_fid),
            ('files', new_content_fid),
        ])

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        archive_fid.close()
        new_content_fid.close()

        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('is not valid', response.json['title'])

    def test_add_file_to_combine_archive_error_handling_upload_archive_by_url(self):
        endpoint = '/combine/file'

        archive_filename = os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        new_content_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        new_content = {
            '_type': 'CombineArchiveContent',
            'location': './NewLocation.txt',
            "filename": new_content_filename,
            'format': 'http://purl.org/NET/mediatypes/text/plain',
            'master': False,
        }

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        new_content_fid = open(new_content_filename, 'rb')

        data = MultiDict([
            ('archive', json.dumps({"url": 'htts://web.com/archive.omex'})),
            ('newContent', json.dumps(new_content)),
            ('files', new_content_fid),
        ])

        def raise_for_status():
            raise requests.exceptions.RequestException()
        get_response = mock.Mock(
            raise_for_status=raise_for_status,
        )

        modified_archive_filename = os.path.join(self.temp_dirname, 'archive.omex')
        with app.app.app.test_client() as client:
            with mock.patch('requests.get', return_value=get_response):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        new_content_fid.close()

        self.assertEqual(response.status_code, 400, response.json)

    def test_validate_is_valid(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
            ('validateSedmlModels', False),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        validation_report.pop('warnings')
        self.assertEqual(validation_report, {
            "_type": "ValidationReport",
            "status": "warnings"
        })

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/validate',
                method='post',
                body={
                    'file': file_content,
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                    'omexMetadataSchema': OmexMetadataSchema.biosimulations.value,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(validation_report),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_validate_is_valid_from_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous-no-changes.omex')

        data = MultiDict([
            ('url', 'https://archive.combine.org'),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
            ('validateSedmlModels', False),
        ])
        endpoint = '/combine/validate'
        with open(archive_filename, 'rb') as file:
            response = response = mock.Mock(
                raise_for_status=lambda: None,
                content=file.read(),
            )
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report, {
            "_type": "ValidationReport",
            "status": "valid"
        })

    def test_validate_is_invalid(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'invalid-SED-ML.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('must have the required attributes', json.dumps(validation_report['errors']))

    def test_validate_is_not_an_archive(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'file.txt')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('is not a valid COMBINE/OMEX archive', json.dumps(validation_report['errors']))

    def test_validate_omex_manifest_option(self):
        # no manifest
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'no-manifest.omex')

        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('is not a valid COMBINE/OMEX archive', json.dumps(validation_report['errors']))

        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
            ('validateOmexManifest', False),
            ('validateOmexMetadata', False),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "warnings")

        # bad manifest
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'bad-manifest.omex')

        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "invalid")
        self.assertIn('is not a valid COMBINE/OMEX archive', json.dumps(validation_report['errors']))

        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
            ('omexMetadataSchema', OmexMetadataSchema.biosimulations.value),
            ('validateOmexManifest', False),
            ('validateOmexMetadata', False),
        ])
        endpoint = '/combine/validate'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        fid.close()
        self.assertEqual(response.status_code, 200, response.json)
        validation_report = response.json

        self.assertEqual(validation_report['status'], "warnings")

    def test_get_similar_algorithms(self):
        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000088'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)
        alt_algs = response.json
        self.assertEqual(alt_algs[0]['algorithms'][1]['id'], 'KISAO_0000088')
        self.assertNotEqual(alt_algs[1]['algorithms'][1]['id'], 'KISAO_0000088')

        alt_alg_ids = [alt_alg['algorithms'][1]['id'] for alt_alg in alt_algs]
        self.assertIn('KISAO_0000019', alt_alg_ids)
        self.assertNotIn('KISAO_0000209', alt_alg_ids)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000088&algorithms=KISAO_0000437'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)
        alt_algs = response.json
        alg_subs = sorted((alt_alg['algorithms'][0]['id'], alt_alg['algorithms'][1]['id'])
                          for alt_alg in alt_algs if alt_alg['maxPolicy']['level'] == 1)
        self.assertEqual(alg_subs, [('KISAO_0000088', 'KISAO_0000088'), ('KISAO_0000437', 'KISAO_0000437')])

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO:9999999'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_9999999'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000209'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)

    def test_get_metadata_for_combine_archive_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        data = MultiDict([
            ('url', archive_url),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        endpoint = '/combine/metadata/biosimulations'
        with mock.patch('requests.get', return_value=response):
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200, response.json)
        metadata = response.json

        sed_output_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.md.json')

        with open(sed_output_specs_filename, 'r') as file:
            expected_metadata = json.load(file)
        self.assertEqual(metadata, expected_metadata, metadata)

        # validate request and response
        if hasattr(self, "request_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/metadata/biosimulations',
                method='post',
                body={
                    'url': archive_url,
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )
            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_metadata),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_metadata_for_combine_archive_file_as_biosimulations(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        endpoint = '/combine/metadata/biosimulations'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        metadata = response.json

        sed_output_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.md.json')
        with open(sed_output_specs_filename, 'r') as file:
            expected_metadata = json.load(file)
        self.assertEqual(metadata, expected_metadata)

        fid.close()

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/metadata/biosimulations',
                method='post',
                body={
                    'file': file_content,
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_metadata),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_metadata_for_combine_archive_file_as_rdf_triples(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        endpoint = '/combine/metadata/rdf'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        metadata = response.json

        self.assertEqual(metadata[0], {
            '_type': 'RdfTriple',
            'subject': {
                '_type': 'RdfUriNode',
                'value': 'http://omex-library.org/Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex',
            },
            'predicate': {
                '_type': 'RdfUriNode',
                'value': 'http://dublincore.org/specifications/dublin-core/dcmi-terms/title',
            },
            'object': {
                '_type': 'RdfLiteralNode',
                'value': 'Morphogenesis checkpoint in budding yeast (continuous) (Ciliberto et al., Journal Cell Biology, 2003)',
            }
        })

        fid.close()

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/metadata/rdf',
                method='post',
                body={
                    'file': file_content,
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(metadata),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_metadata_for_combine_archive_error_handling(self):
        endpoint = '/combine/metadata/biosimulations'
        data = MultiDict([
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('must be used', response.json['title'])

        if hasattr(self, "response_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/metadata/biosimulations',
                method='post',
                body={
                    'url': 'x',
                    'omexMetadataFormat': OmexMetadataInputFormat.rdfxml.value,
                },
                mimetype=None,
                parameters=RequestParameters(),
            )
            response = OpenAPIResponse(
                data=json.dumps(response.json),
                status_code=400,
                mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'invalid-metadata.omex')
        fid = open(archive_filename, 'rb')
        data = MultiDict([
            ('file', fid),
            ('omexMetadataFormat', OmexMetadataInputFormat.rdfxml.value),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('is not valid', response.json['title'])
        fid.close()

    def test__convert_rdf_node_to_json(self):
        with self.assertRaises(BadRequestException):
            _convert_rdf_node_to_json(None)

    def test_get_file_in_combine_archive_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        resolve_archive_response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        endpoint = '/combine/file?url={}&location={}'.format(
            urllib.parse.quote(archive_url),
            urllib.parse.quote('Figure1.jpg'),
        )
        with mock.patch('requests.get', return_value=resolve_archive_response):
            with app.app.app.test_client() as client:
                response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)
        image_filename = os.path.join(self.temp_dirname, 'image')
        with open(image_filename, 'wb') as file:
            file.write(response.data)

        self.assertEqual(imghdr.what(image_filename), 'jpeg')

        # validate request and response
        if hasattr(self, "request_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/file',
                method='get',
                body={
                    'url': archive_url,
                    'location': 'Figure1.jpg',
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(url=archive_url,
                                             location='Figure1.jpg'),
            )
            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=response.data,
                                       status_code=200,
                                       mimetype='image/jpeg')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_get_file_in_combine_archive_error_handling(self):
        endpoint = '/combine/file?url={}&location={}'.format(
            urllib.parse.quote('x'),
            urllib.parse.quote('Figure1.jpg'),
        )
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)
        self.assertTrue(response.json['title'].startswith(
            'COMBINE/OMEX archive could not be loaded'))

        if hasattr(self, "response_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/file',
                method='get',
                mimetype=None,
                parameters=RequestParameters(url='x', location='Figure1.jpg'),
            )
            response = OpenAPIResponse(
                data=json.dumps(response.json),
                status_code=400,
                mimetype='image/jpeg')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

        archive_filename = os.path.join(
            self.FIXTURES_DIR, 'Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        resolve_archive_response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        endpoint = '/combine/file?url={}&location={}'.format(
            urllib.parse.quote(archive_url),
            urllib.parse.quote('undefined'),
        )
        with mock.patch('requests.get', return_value=resolve_archive_response):
            with app.app.app.test_client() as client:
                response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('not a valid location', response.json['title'])
