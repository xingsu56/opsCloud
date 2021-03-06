'use strict';

app.controller('jenkinsProjectsAndroidCtrl', function ($scope, $state, $uibModal, $sce, $timeout, httpService, toaster, staticModel) {
    $scope.authPoint = $state.current.data.authPoint;

    $scope.paramType = staticModel.jenkinsProjectParamType;

    //$scope.jobEnvType = staticModel.jenkinsJobEnvType;


    $scope.thisBuildType = 1;

    $scope.buildType = staticModel.jenkinsBuildType;

    $scope.queryProjectName = "";
    $scope.queryContent = "";


    /////////////////////////////////////////////////

    // 执行按钮
    $scope.butBuildSpinDisabled = false;
    /////////////////////////////////////////////////

    $scope.pageData = [];
    $scope.totalItems = 0;
    $scope.currentPage = 0;
    $scope.pageLength = 10;


    $scope.pageChanged = function () {
        $scope.doQuery();
    };

    /////////////////////////////////////////////////


    $scope.doQuery = function () {
        var url = "/jenkins/projects/page?"
            + "projectName=" + ($scope.queryProjectName == null ? "" : $scope.queryProjectName) + "&"
            + "content=" + ($scope.queryContent == null ? -1 : $scope.queryContent) + "&"
            + "buildType=" + $scope.thisBuildType + "&"
            + "page=" + ($scope.currentPage <= 0 ? 0 : $scope.currentPage - 1) + "&"
            + "length=" + $scope.pageLength;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                var body = data.body;
                $scope.totalItems = body.size;
                $scope.pageData = body.data;
                //  $scope.refreshLeaderUserInfo();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.doQuery();

    ////////////////////////////////////////////////////////

    $scope.reSet = function () {
        $scope.nowJobEnvType = -1;
        $scope.nowBuildType = -1;
        $scope.queryJobName = "";
        $scope.doQuery();
    }

    ///////////////////////////////////////////////////////////////////

    $scope.addProject = function () {
        var projectItem = {
            id: 0,
            projectName: "",
            content: "",
            repositoryUrl: "",
            buildType: 1
        }

        var modalInstance = $uibModal.open({
            templateUrl: 'jenkinsProjectsModal',
            controller: 'jenkinsProjectsInstanceCtrl',
            size: 'lg',
            resolve: {
                httpService: function () {
                    return httpService;
                },
                buildType: function () {
                    return $scope.buildType;
                },
                paramType: function () {
                    return $scope.paramType;
                },
                projectItem: function () {
                    return projectItem;
                },
            }
        });

        modalInstance.result.then(function () {
            $scope.doQuery();
        }, function () {
            $scope.doQuery();
        });
    }

    $scope.editProject = function (projectItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'jenkinsProjectsModal',
            controller: 'jenkinsProjectsInstanceCtrl',
            size: 'lg',
            resolve: {
                httpService: function () {
                    return httpService;
                },
                buildType: function () {
                    return $scope.buildType;
                },
                paramType: function () {
                    return $scope.paramType;
                },
                projectItem: function () {
                    return projectItem;
                },
            }
        });

        modalInstance.result.then(function () {
            $scope.doQuery();
        }, function () {
            $scope.doQuery();
        });
    }

    $scope.delProject = function (id) {
        var url = "/jenkins/project/del?"
            + "id=" + id;

        httpService.doDelete(url).then(function (data) {
            if (data.success) {
                toaster.pop("success", "删除成功!");
                $scope.doQuery();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.buildJob = function (item) {
        // buildType 2 = ios job
        if (item.buildType == 2) {

            var modalInstance = $uibModal.open({
                templateUrl: 'jenkinsJobBuildModal',
                controller: 'jenkinsJobBuildInstanceCtrl',
                size: 'lg',
                resolve: {
                    httpService: function () {
                        return httpService;
                    },
                    jobEnvType: function () {
                        return $scope.jobEnvType;
                    },
                    buildType: function () {
                        return $scope.buildType;
                    },
                    jobItem: function () {
                        return item;
                    },
                }
            });

            modalInstance.result.then(function () {
                $scope.doQuery();
            }, function () {
                $scope.doQuery();
            });
        } else {
            $scope.butBuildSpinDisabled = true;
            var url = "/jenkins/jobs/build?"
                + "id=" + item.id;
            httpService.doGet(url).then(function (data) {
                if (data.success) {
                    toaster.pop("success", "执行成功!");
                    $scope.doQuery();
                    $scope.butBuildSpinDisabled = false;
                } else {
                    toaster.pop("warning", data.msg);
                    $scope.butBuildSpinDisabled = false;
                }
            }, function (err) {
                toaster.pop("error", err);
                $scope.butBuildSpinDisabled = false;
            });
        }
    }


    $scope.viewBuilds = function (jobItem) {

        var modalInstance = $uibModal.open({
            templateUrl: 'jenkinsAndroidJobBuildsModal',
            controller: 'jenkinsAndroidJobBuildsInstanceCtrl',
            size: 'lg',
            resolve: {
                httpService: function () {
                    return httpService;
                },
                jobEnvType: function () {
                    return $scope.jobEnvType;
                },
                buildType: function () {
                    return $scope.buildType;
                },
                jobItem: function () {
                    return jobItem;
                },
            }
        });

        modalInstance.result.then(function () {
            $scope.doQuery();
        }, function () {
            $scope.doQuery();
        });
    }

});

app.controller('jenkinsAndroidCtrl', function ($scope, $state, $uibModal, $sce, $timeout, httpService, toaster, staticModel) {
    $scope.authPoint = $state.current.data.authPoint;

    //$scope.hookType = staticModel.hookType;
    $scope.jobEnvType = staticModel.jenkinsJobEnvType;

    $scope.thisBuildType = 1;

    $scope.buildType = staticModel.jenkinsBuildType;
    $scope.nowJobEnvType = -1;
    $scope.nowBuildType = -1;
    $scope.queryJobName = "";
    /////////////////////////////////////////////////

    // 执行按钮
    $scope.butBuildSpinDisabled = false;
    /////////////////////////////////////////////////

    $scope.pageData = [];
    $scope.totalItems = 0;
    $scope.currentPage = 0;
    $scope.pageLength = 10;


    $scope.pageChanged = function () {
        $scope.doQuery();
    };

    /////////////////////////////////////////////////


    $scope.doQuery = function () {
        var url = "/jenkins/jobs/page?"
            + "jobName=" + ($scope.queryJobName == null ? "" : $scope.queryJobName) + "&"
            + "jobEnvType=" + ($scope.nowJobEnvType == null ? -1 : $scope.nowJobEnvType) + "&"
            + "buildType=" + $scope.thisBuildType + "&"
            + "page=" + ($scope.currentPage <= 0 ? 0 : $scope.currentPage - 1) + "&"
            + "length=" + $scope.pageLength;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                var body = data.body;
                $scope.totalItems = body.size;
                $scope.pageData = body.data;
                //  $scope.refreshLeaderUserInfo();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.doQuery();

    ////////////////////////////////////////////////////////

    $scope.reSet = function () {
        $scope.nowJobEnvType = -1;
        $scope.nowBuildType = -1;
        $scope.queryJobName = "";
        $scope.doQuery();
    }

    ///////////////////////////////////////////////////////////////////

    $scope.addJob = function () {
        var jobItem = {
            id: 0,
            jobName: "",
            jobEnvType: -1,
            repositoryUrl: "",
            buildType: 1,
            content: ""
        }

        var modalInstance = $uibModal.open({
            templateUrl: 'jenkinsJobModal',
            controller: 'jenkinsJobInstanceCtrl',
            size: 'lg',
            resolve: {
                httpService: function () {
                    return httpService;
                },
                jobEnvType: function () {
                    return $scope.jobEnvType;
                },
                buildType: function () {
                    return $scope.buildType;
                },
                jobItem: function () {
                    return jobItem;
                },
            }
        });

        modalInstance.result.then(function () {
            $scope.doQuery();
        }, function () {
            $scope.doQuery();
        });
    }

    $scope.editJob = function (jobItem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'jenkinsJobModal',
            controller: 'jenkinsJobInstanceCtrl',
            size: 'lg',
            resolve: {
                httpService: function () {
                    return httpService;
                },
                jobEnvType: function () {
                    return $scope.jobEnvType;
                },
                buildType: function () {
                    return $scope.buildType;
                },
                jobItem: function () {
                    return jobItem;
                },
            }
        });

        modalInstance.result.then(function () {
            $scope.doQuery();
        }, function () {
            $scope.doQuery();
        });
    }

    $scope.delJob = function (id) {
        var url = "/jenkins/jobs/del?"
            + "id=" + id;

        httpService.doDelete(url).then(function (data) {
            if (data.success) {
                toaster.pop("success", "删除成功!");
                $scope.doQuery();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.buildJob = function (item) {
        // buildType 2 = ios job
        if (item.buildType == 2) {

            var modalInstance = $uibModal.open({
                templateUrl: 'jenkinsJobBuildModal',
                controller: 'jenkinsJobBuildInstanceCtrl',
                size: 'lg',
                resolve: {
                    httpService: function () {
                        return httpService;
                    },
                    jobEnvType: function () {
                        return $scope.jobEnvType;
                    },
                    buildType: function () {
                        return $scope.buildType;
                    },
                    jobItem: function () {
                        return item;
                    },
                }
            });

            modalInstance.result.then(function () {
                $scope.doQuery();
            }, function () {
                $scope.doQuery();
            });
        } else {
            $scope.butBuildSpinDisabled = true;
            var url = "/jenkins/jobs/build?"
                + "id=" + item.id;
            httpService.doGet(url).then(function (data) {
                if (data.success) {
                    toaster.pop("success", "执行成功!");
                    $scope.doQuery();
                    $scope.butBuildSpinDisabled = false;
                } else {
                    toaster.pop("warning", data.msg);
                    $scope.butBuildSpinDisabled = false;
                }
            }, function (err) {
                toaster.pop("error", err);
                $scope.butBuildSpinDisabled = false;
            });
        }
    }


    $scope.viewBuilds = function (jobItem) {

        var modalInstance = $uibModal.open({
            templateUrl: 'jenkinsAndroidJobBuildsModal',
            controller: 'jenkinsAndroidJobBuildsInstanceCtrl',
            size: 'lg',
            resolve: {
                httpService: function () {
                    return httpService;
                },
                jobEnvType: function () {
                    return $scope.jobEnvType;
                },
                buildType: function () {
                    return $scope.buildType;
                },
                jobItem: function () {
                    return jobItem;
                },
            }
        });

        modalInstance.result.then(function () {
            $scope.doQuery();
        }, function () {
            $scope.doQuery();
        });
    }

});

app.controller('jenkinsJobInstanceCtrl', function ($scope, $uibModalInstance, toaster, staticModel, httpService, jobEnvType, buildType, jobItem) {
    $scope.jobItem = jobItem;
    $scope.jobEnvType = jobEnvType;
    $scope.buildType = buildType;
    $scope.paramList = [];
    $scope.nowParam = {};


    $scope.nowParam = {
        id: 0,
        jobId: 0,
        paramName: "",
        paramValue: "",
        content: ""
    };

    $scope.resetParam = function () {
        $scope.nowParam = {
            id: 0,
            jobId: 0,
            paramName: "",
            paramValue: "",
            content: ""
        }
    }

    $scope.alert = {
        type: "",
        msg: ""
    };

    $scope.closeAlert = function () {
        $scope.alert = {
            type: "",
            msg: ""
        };
    }

    $scope.resetJob = function () {
        $scope.jobItem = {
            id: 0,
            jobName: "",
            jobEnvType: -1,
            repositoryUrl: "",
            buildType: -1,
            content: ""
        }
    }

    $scope.saveJob = function () {

        var url = "/jenkins/jobs/save";

        if ($scope.jobItem.jobName == null || $scope.jobItem.jobName == '') {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "任务名称未指定!";
            return;
        }
        if ($scope.jobItem.jobEnvType == -1) {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "环境类型未指定!";
            return;
        }
        if ($scope.jobItem.buildType == -1) {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "构建类型未指定!";
            return;
        }

        httpService.doPostWithJSON(url, $scope.jobItem).then(function (data) {
            if (data.success) {
                $scope.jobItem = data.body;

                $scope.alert.type = 'success';
                $scope.alert.msg = "保存成功!";
            } else {
                $scope.alert.type = 'warning';
                $scope.alert.msg = data.msg;
            }
        }, function (err) {
            $scope.alert.type = 'danger';
            $scope.alert.msg = err;
        });
    }

    //////////////////////////////////////////////////////

    $scope.queryParams = function () {
        if ($scope.jobItem.id == 0) return;

        var url = "/jenkins/jobs/params/query?"
            + "jobId=" + $scope.jobItem.id;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                $scope.paramList = data.body;
                //$scope.totalItems = body.size;
                //$scope.pageData = body.data;
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.queryParams();


    $scope.saveParam = function () {
        var url = "/jenkins/jobs/params/save";

        if ($scope.nowParam.paramName == null || $scope.nowParam.paramName == '') {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "参数名称未指定!";
            return;
        }
        if ($scope.nowParam.paramValue == null || $scope.nowParam.paramValue == '') {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "参数值未指定!";
            return;
        }
        if ($scope.jobItem.id == 0) {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "当前任务未创建!";
            return;
        } else {
            $scope.nowParam.jobId = $scope.jobItem.id;
        }

        httpService.doPostWithJSON(url, $scope.nowParam).then(function (data) {
            if (data.success) {
                $scope.alert.type = 'success';
                $scope.alert.msg = "保存成功!";
                $scope.resetParam();
                $scope.queryParams();
            } else {
                $scope.alert.type = 'warning';
                $scope.alert.msg = data.msg;
            }
        }, function (err) {
            $scope.alert.type = 'danger';
            $scope.alert.msg = err;
        });
    }

    $scope.editParam = function (item) {
        $scope.nowParam = item;
    }

    $scope.delParam = function (id) {
        var url = "/jenkins/jobs/params/del?"
            + "id=" + id;
        httpService.doDelete(url).then(function (data) {
            if (data.success) {
                toaster.pop("success", "删除成功!");
                $scope.queryParams();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    }

});

app.controller('jenkinsJobBuildInstanceCtrl', function ($scope, $uibModalInstance, toaster, httpService, jobEnvType, jobItem) {
    $scope.jobItem = jobItem;
    $scope.jobEnvType = jobEnvType;
    $scope.refs = [];
    // $scope.listRefsSpinDisabled = true;
    $scope.doQueryRefs = true;

    $scope.runBuilding = false;
    //$scope.butBuildSpinDisabled = false;
    $scope.nowMbranch = {};
    // iOS默认构建环境daily
    $scope.nowEnvType = "daily";

    $scope.initRefs = function (refs) {
        if (refs == null) return;
        $scope.refs = [];
        if (refs.branches.length != 0) {
            for (var i = 0; i < refs.branches.length; i++) {
                var ref = {
                    type: "branches",
                    name: refs.branches[i]
                }
                $scope.refs.push(ref);
            }
        }
        if (refs.tags.length != 0) {
            for (var i = 0; i < refs.tags.length; i++) {
                var ref = {
                    type: "tags",
                    name: refs.tags[i]
                }
                $scope.refs.push(ref);
            }
        }
    }

    $scope.alert = {
        type: "",
        msg: ""
    };

    $scope.closeAlert = function () {
        $scope.alert = {
            type: "",
            msg: ""
        };
    }

    $scope.resetJob = function () {
        $scope.jobItem = {
            id: 0,
            jobName: "",
            jobEnvType: -1,
            repositoryUrl: "",
            buildType: -1,
            content: ""
        }
    }


    //////////////////////////////////////////////////////

    // 查询分支 数据库缓存
    $scope.queryRefs = function () {
        $scope.doQueryRefs = true;

        var url = "/jenkins/job/refs/query?"
            + "id=" + $scope.jobItem.id;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                $scope.initRefs(data.body);
                //$scope.refs = data.body;
            } else {
                toaster.pop("warning", data.msg);
            }
            $scope.doQueryRefs = false;
        }, function (err) {
            toaster.pop("error", err);
            $scope.doQueryRefs = false;
        });
    }

    $scope.queryRefs();

    // 获取最新分支
    $scope.getRefs = function () {
        $scope.doQueryRefs = true;
        var url = "/jenkins/job/refs/get?"
            + "id=" + $scope.jobItem.id;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                $scope.initRefs(data.body);
                //$scope.refs = data.body;
            } else {
                toaster.pop("warning", data.msg);
            }
            $scope.doQueryRefs = false;
        }, function (err) {
            toaster.pop("error", err);
            $scope.doQueryRefs = false;
        });
    }

    $scope.alert = {
        type: "",
        msg: ""
    };

    $scope.closeAlert = function () {
        $scope.alert = {
            type: "",
            msg: ""
        };
    }

    $scope.buildJob = function () {

        if ($scope.nowMbranch.selected == null || $scope.nowMbranch.selected.name == '') {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "必须指定分支";
            return;
        }

        $scope.closeAlert();
        $scope.runBuilding = true;
        var url = "/jenkins/jobs/ios/build?"
            + "id=" + $scope.jobItem.id
            + "&mbranch=" + $scope.nowMbranch.selected.name
            + "&buildType=" + $scope.nowEnvType;
        httpService.doGet(url).then(function (data) {
            if (data.success) {
                //toaster.pop("success", "执行成功!");
                $scope.alert.type = 'success';
                $scope.alert.msg = "执行成功!";
            } else {
                $scope.alert.type = 'warning';
                $scope.alert.msg = data.msg;
                //toaster.pop("warning", data.msg);

            }
            $scope.runBuilding = false;
        }, function (err) {
            $scope.alert.type = 'error';
            $scope.alert.msg = err;
            $scope.runBuilding = false;
        });


    }

});

/**
 * 任务详情
 */
app.controller('jenkinsAndroidJobBuildsInstanceCtrl', function ($scope, $uibModalInstance, $sce, toaster, httpService, jobEnvType, jobItem) {

    $scope.jobItem = jobItem;
    $scope.jobEnvType = jobEnvType;

    $scope.butBuildSpinDisabled = false;
    $scope.butAppLinkSpinDisabled = false;
    /////////////////////////////////////////////////

    $scope.pageData = [];
    $scope.totalItems = 0;
    $scope.currentPage = 0;
    $scope.pageLength = 10;

    // 生成参数
    $scope.refreshParamsInfo = function () {

        if ($scope.pageData.length == 0) return;

        for (var i = 0; i < $scope.pageData.length; i++) {
            var info = '<b style="color: #286090">执行参数</b>';
            info += '<hr style="margin-bottom: 2px; margin-top: 2px" />';
            var item = $scope.pageData[i];
            //var params = $scope.pageData[i].paramList;
            if (item.paramList.length == 0) return;
            for (var j = 0; j < item.paramList.length; j++) {
                var param = item.paramList[j];
                info += '<b style="color: red">' + param.paramName + "</b>:";
                info += '<b style="color: green">' + param.paramValue + "</b> <br/>";
            }
            item.paramsInfo = $sce.trustAsHtml(
                info
            );
        }

    }

    $scope.pageChanged = function (currentPage) {
        $scope.currentPage = currentPage;
        $scope.doQuery();
    };


    $scope.doQuery = function () {
        var url = "/jenkins/job/builds/page?"
            + "jobName=" + $scope.jobItem.jobName + "&"
            + "buildNumber=0&"
            + "page=" + ($scope.currentPage <= 0 ? 0 : ($scope.currentPage - 1)) + "&"
            + "length=" + $scope.pageLength;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                var body = data.body;
                $scope.totalItems = body.size;
                $scope.pageData = body.data;
                $scope.refreshParamsInfo();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.doQuery();

    // 判断任务是否结束
    $scope.checkBuildCompleted = function (jobNotes) {

        if (jobNotes == null || jobNotes.length == 0) return true;
        for (var i = 0; i < jobNotes.length; i++) {
            var item = jobNotes[i];
            if (item.buildPhase == "COMPLETED") return false;
        }
        return true;
    }

    $scope.rebuildJob = function (id) {
        $scope.butBuildSpinDisabled = true;
        var url = "/jenkins/jobs/rebuild?"
            + "id=" + id;
        httpService.doGet(url).then(function (data) {
            if (data.success) {
                toaster.pop("success", "执行成功!");
                $scope.doQuery();
                $scope.butBuildSpinDisabled = false;
            } else {
                toaster.pop("warning", data.msg);
                $scope.butBuildSpinDisabled = false;
            }
        }, function (err) {
            toaster.pop("error", err);
            $scope.butBuildSpinDisabled = false;
        });
    }

    $scope.appLink = function (id) {
        $scope.butAppLinkSpinDisabled = true;
        var url = "/jenkins/jobs/appLink?"
            + "id=" + id;
        httpService.doGet(url).then(function (data) {
            if (data.success) {
                toaster.pop("success", "执行成功!");
                //$scope.doQuery();
                $scope.butAppLinkSpinDisabled = false;
            } else {
                toaster.pop("warning", data.msg);
                $scope.butAppLinkSpinDisabled = false;
            }
        }, function (err) {
            toaster.pop("error", err);
            $scope.butAppLinkSpinDisabled = false;
        });
    }

});

/**
 * 项目详情
 */
app.controller('jenkinsProjectsInstanceCtrl', function ($scope, $uibModalInstance, toaster, staticModel, httpService, buildType, paramType, projectItem) {
    $scope.projectItem = projectItem;
    $scope.paramType = paramType;
    $scope.buildType = buildType;
    $scope.jobEnvType = [];

    $scope.baseParamList = [];
    $scope.nowBaseParam = {};
    $scope.nowEnv = {};
    $scope.envList = [];

    $scope.nowEnv = {
        id: 0,
        projectId: 0,
        envType: -1,
        jobsId: 0,
        content: ""
    };

    $scope.nowBaseParam = {
        id: 0,
        projectId: 0,
        paramName: "",
        paramValue: "",
        paramType: 0,
        content: ""
    };

    $scope.alert = {
        type: "",
        msg: ""
    };

    $scope.resetBaseParam = function () {
        $scope.nowBaseParam = {
            id: 0,
            projectId: 0,
            paramName: "",
            paramValue: "",
            paramType: 0,
            content: ""
        }
    }


    $scope.closeAlert = function () {
        $scope.alert = {
            type: "",
            msg: ""
        };
    }

    $scope.resetProject = function () {
        $scope.projectItem = {
            id: 0,
            projectName: "",
            repositoryUrl: "",
            buildType: 1,
            content: ""
        }
    }

    $scope.saveProject = function () {

        if ($scope.projectItem.projectName == null || $scope.projectItem.projectName == '') {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "项目名称未指定!";
            return;
        }

        if ($scope.projectItem.repositoryUrl == null || $scope.projectItem.repositoryUrl == '') {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "仓库地址未指定!";
            return;
        }

        if ($scope.projectItem.content == null || $scope.projectItem.content == '') {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "项目说明未指定!";
            return;
        }

        $scope.projectItem.buildType = 1;

        var url = "/jenkins/project/save";
        httpService.doPostWithJSON(url, $scope.projectItem).then(function (data) {
            if (data.success) {
                $scope.projectItem = data.body;
                $scope.alert.type = 'success';
                $scope.alert.msg = "保存成功!";
            } else {
                $scope.alert.type = 'warning';
                $scope.alert.msg = data.msg;
            }
        }, function (err) {
            $scope.alert.type = 'danger';
            $scope.alert.msg = err;
        });
    }

    //////////////////////////////////////////////////////


    $scope.queryBaseParams = function () {
        if ($scope.projectItem.id == 0) return;

        var url = "/jenkins/project/params/query?"
            + "id=" + $scope.projectItem.id;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                $scope.baseParamList = data.body;
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.queryBaseParams();


    $scope.saveBaseParam = function () {
        var url = "/jenkins/project/params/save";

        if ($scope.nowBaseParam.paramName == null || $scope.nowBaseParam.paramName == '') {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "参数名称未指定!";
            return;
        }
        if ($scope.nowBaseParam.paramType == 0 && ($scope.nowBaseParam.paramValue == null || $scope.nowBaseParam.paramValue == '')) {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "参数值未指定!";
            return;
        }
        if ($scope.projectItem.id == 0) {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "项目尚未创建!";
            return;
        } else {
            $scope.nowBaseParam.projectId = $scope.projectItem.id;
        }

        httpService.doPostWithJSON(url, $scope.nowBaseParam).then(function (data) {
            if (data.success) {
                $scope.alert.type = 'success';
                $scope.alert.msg = "保存成功!";
                $scope.resetBaseParam();
                $scope.queryBaseParams();
            } else {
                $scope.alert.type = 'warning';
                $scope.alert.msg = data.msg;
            }
        }, function (err) {
            $scope.alert.type = 'danger';
            $scope.alert.msg = err;
        });
    }

    $scope.editBaseParam = function (item) {
        $scope.nowBaseParam = item;
    }

    $scope.delBaseParam = function (id) {
        var url = "/jenkins/project/params/del?"
            + "id=" + id;
        httpService.doDelete(url).then(function (data) {
            if (data.success) {
                toaster.pop("success", "删除成功!");
                $scope.queryBaseParams();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    ////////////////////////////////////////

    $scope.addEnv = function () {
        var url = "/jenkins/project/env/save";

        if ($scope.nowEnv.envType == -1) {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "环境未指定!";
            return;
        }
        if ($scope.projectItem.id == 0) {
            $scope.alert.type = 'warning';
            $scope.alert.msg = "项目尚未创建!";
            return;
        } else {
            $scope.nowEnv.projectId = $scope.projectItem.id;
        }

        httpService.doPostWithJSON(url, $scope.nowEnv).then(function (data) {
            if (data.success) {
                $scope.alert.type = 'success';
                $scope.alert.msg = "保存成功!";
                // $scope.resetBaseParam();
                $scope.queryEnvs();
            } else {
                $scope.alert.type = 'warning';
                $scope.alert.msg = data.msg;
            }
        }, function (err) {
            $scope.alert.type = 'danger';
            $scope.alert.msg = err;
        });
    }

    /**
     * 保存参数
     */
    $scope.saveEnv = function (item) {
        var url = "/jenkins/project/env/params/save";

        httpService.doPostWithJSON(url, item).then(function (data) {
            if (data.success) {
                $scope.alert.type = 'success';
                $scope.alert.msg = "保存成功!";
                $scope.queryEnvs();
            } else {
                $scope.alert.type = 'warning';
                $scope.alert.msg = data.msg;
            }
        }, function (err) {
            $scope.alert.type = 'danger';
            $scope.alert.msg = err;
        });
    }

    var refreshJobEnvType = function () {
        $scope.jobEnvType = [
            {
                code: 2,
                name: "daily"
            },
            {
                code: 3,
                name: "gray"
            },
            {
                code: 4,
                name: "onlineDev"
            },
            {
                code: 5,
                name: "release"
            },
            {
                code: 7,
                name: "debug"
            }
        ];
        if ($scope.envList.length == 0) return;

        for (var i = 0; i < $scope.envList.length; i++) {
            var env = $scope.envList[i];
            for (var j = 0; j < $scope.jobEnvType.length; j++) {
                if (env.envType == $scope.jobEnvType[j].code) {
                    $scope.jobEnvType.splice(j,1);
                }
            }
        }
    }



    $scope.queryEnvs = function () {
        if ($scope.projectItem.id == 0) return;

        var url = "/jenkins/project/env/query?"
            + "id=" + $scope.projectItem.id;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                $scope.envList = data.body;
                refreshJobEnvType();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    $scope.queryEnvs();

    $scope.delEnv = function (item) {
        var url = "/jenkins/project/env/del?"
            + "id=" + item.id + "&"
            + "projectId=" + item.projectId + "&"
            + "envType=" + item.envType;
        httpService.doDelete(url).then(function (data) {
            if (data.success) {
                $scope.alert.type = 'success';
                $scope.alert.msg = "删除成功!";
                $scope.queryEnvs();
            } else {
                $scope.alert.type = 'warning';
                $scope.alert.msg = data.msg;
            }
        }, function (err) {
            $scope.alert.type = 'danger';
            $scope.alert.msg = err;
        });
    }

    ////////////////////////////////////////

    $scope.addJob = function (item) {
        var url = "/jenkins/project/job/save?id=" + item.id;

        httpService.doGet(url).then(function (data) {
            if (data.success) {
                $scope.queryEnvs();
            } else {
                toaster.pop("warning", data.msg);
            }
        }, function (err) {
            toaster.pop("error", err);
        });
    }

    ////////////////////////////////////////

    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    }

});